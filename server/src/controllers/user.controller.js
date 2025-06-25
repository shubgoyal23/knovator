import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResposne.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { userDataRemoveSensitiveData } from "../helpers/helpers.js";

const generateAccessTokenAndRefresToken = async (id) => {
   try {
      const user = await User.findById(id);
      const refreshToken = await user.generateRefreshToken();
      const accessToken = await user.generateAccessToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { refreshToken, accessToken };
   } catch (error) {
      console.log(error);
      throw new ApiError(500, "error generating refrestToken");
   }
};
const registeruser = asyncHandler(async (req, res) => {
   const { firstName, lastName, email, password } = req.body;

   if (!firstName || !email || !password) {
      throw new ApiError(
         401,
         "firstName, Email, and Password is required to register user"
      );
   }

   const checkuser = await User.findOne({ email });
   if (checkuser) {
      throw new ApiError(403, "User with same Email id is already registered");
   }

   const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      isActive: false,
   });
   const checkUserRegistered = await User.findOne({ email });
   if (!checkUserRegistered) {
      throw new ApiError(500, "user registration failed");
   }
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            null,
            "user Registered successfully"
         )
      );
});

const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new ApiError(401, "Email, and Password is required to Login");
   }

   const finduser = await User.findOne({ email });
   if (!finduser) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }
   if (!finduser.isActive) {
      throw new ApiError(
         403,
         "Email Not Verified, Please wait for verification"
      );
   }
   if (finduser.thirdPartyLogin) {
      throw new ApiError(
         403,
         `You are registered with ${finduser.thirdPartyLogin} account. Please login with ${finduser.thirdPartyLogin} account`
      );
   }

   const checkpass = await finduser.checkPassword(password);

   if (!checkpass) {
      throw new ApiError(403, "Wrong Email or Password");
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(finduser._id);

   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
   };

   let user = userDataRemoveSensitiveData(finduser);

   user.refreshToken = refreshToken;
   user.accessToken = accessToken;

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "User Logged in successfully"));
});

const loginUserGoogle = asyncHandler(async (req, res) => {
   const { token } = req.body;

   if (!token) {
      throw new ApiError(401, "Tokein is required to Login");
   }
   const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
   );

   const { tokens } = await client.getToken({
      code: token,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
   });

   if (!tokens) {
      throw new ApiError(403, "User not found, check Email id or register one");
   }
   client.setCredentials(tokens);

   const userInfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
   });

   let payload = userInfo.data;
   const email = payload?.email;

   let finduser = await User.findOne({ email });
   if (!finduser) {
      finduser = await User.create({
         email,
         firstName: payload?.given_name,
         lastName: payload?.family_name,
         picture: payload?.picture,
         isActive: false,
         thirdPartyLogin: true,
         thirdPartyInfo: {
            provider: "Google",
            uid: payload?.id,
         },
      });
   }

   if (!finduser.isActive) {
      throw new ApiError(
         403,
         "Email Not Verified, Please verify your email to login"
      );
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(finduser._id);

   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
   };
   let user = userDataRemoveSensitiveData(finduser)

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, user, "User Logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
   const { _id } = req.user;

   const finduser = await User.findByIdAndUpdate(
      _id,
      {
         $unset: {
            refreshToken: 1,
         },
      },
      { new: true }
   );

   if (!finduser) {
      throw new ApiError(403, "User not found");
   }

   const options = {
      httpOnly: true,
      secure: true,
   };

   res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out Successfully"));
});

const currentUser = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
   let token = req.cookies.refreshToken || req.headers.refreshtoken;
   token = token?.replace("Bearer ", "");
   if (!token) {
      throw new ApiError(401, "RefreshToken not found");
   }
   const decodedToken = await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
   );

   const user = await User.findById(decodedToken._id);

   if (!user && !(user?.refreshToken === token)) {
      throw new ApiError(401, "User not found");
   }

   const { refreshToken, accessToken } =
      await generateAccessTokenAndRefresToken(user._id);

   let userData = userDataRemoveSensitiveData(user);

   userData.accessToken = accessToken;
   userData.refreshToken = refreshToken;
   const options = {
      httpOnly: true,
      secure: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
   };

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, userData, "Tokens Renewed successfully"));
});

export {
   registeruser,
   loginUser,
   logoutUser,
   currentUser,
   refreshToken,
   loginUserGoogle,
};
