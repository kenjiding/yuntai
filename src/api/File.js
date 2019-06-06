import Base from '@/api/Base';

class File extends Base {
  constructor () {
    const baseUrl = '';
    super(baseUrl, true);
  }

  // 上传后，访问文件时，网址需要带上授权参数
  uploadPrivate (data) {
    return this.post('/file/api/v1/file/UploadPrivate', data);
  };

  //
  generateUrl (data) {
    return this.get('/file/api/v1/file/GenerateUrl', data);
  };

  //
  generatePrivateUploadToken (data) {
    return this.post('/file/api/v1/file/GeneratePrivateUploadToken', data);
  };

  generatePublicUploadToken (data) {
    return this.post('/file/api/v1/file/GeneratePublicUploadToken', data);
  };
//{actions}
}

export default new File();
