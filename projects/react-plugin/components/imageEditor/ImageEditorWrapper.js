import React from 'react';
import ImageEditor from 'filerobot-image-editor';
import { getPubliclink, getCDNlink } from '../../utils/adjustAPI.utils';


const goBack = (prevTab, setPostUpload, options = {}, closeModal) => {
  if (options.closeOnEdit) {
    closeModal();

    return;
  }

  if (prevTab === 'TAGGING')
    setPostUpload(true, 'TAGGING', 'IMAGE_EDITOR');
  else
    setPostUpload(false);
};

const uploadFiles = (prevTab, url, file, saveUploadedFiles, setPostUpload, options = {}, closeModal, uploadHandler) => {
  const files = [{ ...file, public_link: getPubliclink(file) }];

  uploadHandler(files, { stage: 'edit' });

  if (options.closeOnEdit) {
    closeModal();

    return;
  }

  if (prevTab === 'TAGGING') {
    const files = [{ ...file, public_link: getPubliclink(file) }];

    saveUploadedFiles(files);

    setPostUpload(true, 'TAGGING');
  }

  else
    setPostUpload(false);
}



export default ({ appState, files: [file = {}] = {}, path, saveUploadedFiles, setPostUpload, options, closeModal }) => {
  const { prevTab, config, modifyURL } = appState;
  const { uploadKey, baseAPI, container, uploadParams, cloudimageToken, uploadHandler, language, imageEditorConfig = {} } = config;
  const isGif = getPubliclink(file).slice(-3).toLowerCase() === 'gif';
  const src = getCDNlink(file);

  const onComplete = (url) => {
    if (modifyURL) {
      const files = [{ ...file, modified_url: url, public_link: getPubliclink(file) }];
      uploadHandler(files, { stage: 'modify' });
      closeModal();
    } else {
      uploadFiles(prevTab, url, file, saveUploadedFiles, setPostUpload, options, closeModal, uploadHandler);
    }
  }

  /**
   * Hack for sealing token.
   * Need to figure out how to check is token support sealing
   */
  const isTokenWithSealing = container === 'fyooyzbm';
  const sealingConfig = isTokenWithSealing ? {
    enabled: true,
    salt: 'test',
    char_count: 10,
    include_params: ['wat', 'wat_url', 'wat_opacity', 'wat_scale', 'wat_pad', 'wat_gravity'],
  } : {};

  return (
    <ImageEditor
      show={true}
      config={{
        isLowQualityPreview: true,
        colorScheme: 'dark',
        language,
        processWithCloudimage: isGif || modifyURL,
        uploadWithCloudimageLink: modifyURL ? !modifyURL : isGif,

        ...imageEditorConfig,

        filerobot: {
          baseAPI,
          token: container,
          uploadKey,
          container,
          uploadParams: {
            ...uploadParams,
            dir: path || uploadParams.dir,
            ...(imageEditorConfig.filerobot && imageEditorConfig.filerobot.uploadParams)
          },
          ...imageEditorConfig.filerobot,
          imageSealing: {
            ...sealingConfig,
            ...((imageEditorConfig.filerobot || {}).imageSealing || {}),
          }
        },

        cloudimage: {
          token: cloudimageToken,
          ...imageEditorConfig.cloudimage
        },
        showGoBackBtn: true
      }}
      closeOnLoad={false}
      src={src}
      onComplete={onComplete}
      onClose={() => { goBack(prevTab, setPostUpload, options, closeModal); }}
      showInModal={false}
    />
  );
}
