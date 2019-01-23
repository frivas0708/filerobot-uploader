const initialState = {
  isVisible: false,
  backgrounds: [],
  modules: [],
  activeTabId: 'UPLOAD',
  uploadHandler: (files = []) => console.warn('Uploaded!', files)
};

export const SET_UPLOADER_CONFIG = 'airstore-uploader/uploader/SET_UPLOADER_CONFIG';
export const MODAL_OPEN = 'airstore-uploader/uploader/MODAL_OPEN';
export const ACTIVATE_TAB = 'airstore-uploader/uploader/ACTIVATE_TAB';


const uploader = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_UPLOADER_CONFIG:
      return _setUploaderConfig(state, action.config);
    case MODAL_OPEN:
      return _visibilityOpen(state, action.tabId);
    case ACTIVATE_TAB:
      return _activateTab(state, action.tabId);
    case 'MODAL_CLOSE':
      return _visibilityClose(state, payload);
    case 'FETCH_BACKGROUNDS_SUCCESS':
      return _fetchBgSuccess(state, payload);
    case 'SET_UPLOAD_HANDLER':
      return _setUploadHandler(state, payload);
    case 'FILES_UPLOADED':
      return _filesUploaded(state, payload);
    default:
      return state;
  }
};

const _fetchBgSuccess = (state, { files = [] }) => {
  const backgrounds = files.map((file = {}) => ({
    src: file.url_public || file.url_permalink,
    id: file.uuid,
    name: file.name,
    alt: ''
  }));

  return { ...state, backgrounds };
};

const _visibilityOpen = (state, activeTabId) => {
  // todo
  //setTimeout(() => {
  //  const link = document.querySelector(`.airstore-uploader-navigation #tab-${activeTab.id}`);
  //
  //  if (link && link.focus) link.focus();
  //})

  return { ...state, isVisible: true, activeTabId };
};

const _visibilityClose = state => ({ ...state, isVisible: false, activeTabId: null });

const _activateTab = (state, activeTabId) => ({ ...state, activeTabId });

const _setUploaderConfig = (state, config = {}) => {
  config.TAGGING = config.TAGGING || {};

  const uploaderConfig = {
    uploadPath: `https://${config.CONTAINER}.api.airstore.io/v1/upload`,
    uploadParams: config.UPLOAD_PARAMS,
    uploadKey: config.AIRSTORE_UPLOAD_KEY,
    openpixKey: config.OPENPIX_KEY,
    container: config.CONTAINER,
    isShowAddTagBtn: config.IS_SHOW_ADD_TAG_BTN,
    isShowNotRelevantBtn: config.IS_SHOW_NOT_RELEVANT_BTN,
    limit: config.LIMIT_IMAGES_PER_RESPONSE || 100,
    folders: config.UPLOADED_FOLDERS || [{ dir: '/', label: 'All' }],
    language: config.LANGUAGE || 'en',
    tagging: {
      active: !!config.TAGGING.active,
      ...config.TAGGING
    },
    uploadHandler: config.onUpload || (() => {})
  };

  return { ...state, uploaderConfig };
};

const _setUploadHandler = (state, onUpload = null) =>
  ({ ...state, uploadHandler: typeof onUpload === 'function' ? onUpload : state.uploadHandler });

const _filesUploaded = (state, files = []) => {
  if (typeof state.uploadHandler === 'function')
    state.uploadHandler(files);
  else
    console.warn('onUpload() is not defined!');

  return { ...state };
};

export default uploader;