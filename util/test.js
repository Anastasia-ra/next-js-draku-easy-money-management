import CloudmersiveOcrApiClient from 'cloudmersive-ocr-api-client';

const defaultClient = CloudmersiveOcrApiClient.ApiClient.instance;

const Apikey = defaultClient.authentications['Apikey'];
Apikey.apiKey = '7a480b37-84b6-4726-b017-77967aacf970';

const apiInstance = new CloudmersiveOcrApiClient.ImageOcrApi();

const imageFile = '/images/IMG20220214195014_50.jpg';

const opts = {};

const callback = function (error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.imageOcrPhotoRecognizeReceipt(imageFile, opts, callback);
