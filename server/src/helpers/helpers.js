import convert from "xml-js";

const userDataRemoveSensitiveData = (user) => {
   let data = user.toObject();

   delete data.password;
   delete data.fcmToken;
   delete data.thirdPartyLogin;
   delete data.thirdPartyInfo;
   delete data.__v;
   delete data.createdAt;
   delete data.updatedAt;
   delete data.refreshToken;

   return data;
};

const parseXML = (xml) => {
   const result = convert.xml2js(xml, { compact: true });
   return result;
};

export { userDataRemoveSensitiveData, parseXML };
