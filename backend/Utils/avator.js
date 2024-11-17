const crypto = require('crypto');
 function generateGravatarUrl (email, size = 200, defaultAvatar = 'identicon'){
  const emailHash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
  const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=${defaultAvatar}`;
  return gravatarUrl;
};
module.exports=generateGravatarUrl;

