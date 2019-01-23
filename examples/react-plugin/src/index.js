import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore, { injectAsyncReducer } from './store';
import { getReducers, AirstoreUploader } from '../../../projects/react-plugin';
import 'scaleflex-react-ui-kit/dist/styledComponents/assets/styles/scaleflex-icon-font.css';

export const store = configureStore();

const AIRSTORE_CONFIG = {
  MODULES: ['UPLOAD', 'UPLOADED_IMAGES', 'ICONS_GALLERY', 'IMAGES_GALLERY'], // optional default: 'UPLOAD', 'UPLOADED_IMAGES', 'ICONS_GALLERY', 'IMAGES_GALLERY'
  UPLOAD_PARAMS: {                 // optional default: {}
    dir: '/dima_test'
  },
  // ELEMENT_ID: 'airstore-uploader', // optional default : 'airstore-uploader'
  UPLOADED_FOLDERS: [                             // required if UPLOADED_IMAGES is set
    { dir: '/dima_test', label: 'All' },
    //{ dir: '/company_test/project_test', label: 'Project' }
  ],
  AIRSTORE_UPLOAD_KEY: '0cbe9ccc4f164bf8be26bd801d53b132', // required
  OPENPIX_KEY: 'xxxxxxxxxxxxxxx',                          // required if ICONS_GALLERY et IMAGES_GALLERY
  CONTAINER: 'example',                           // required
  INITIAL_TAB: 'UPLOAD',                          // optional   default first module
  TAGGING: {
    active: true,
    auto_tagging: true,
    provider: 'google', // google|imagga
    confidence: 60, //  [0..100]
    limit: 10,
    key: 'aaaa'
  },
  LANGUAGE: 'ru',         // optional   default first module
  onUpload: (img) => { console.log(img) }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      isShow: false
    }
  }

  componentDidMount() {
    const AsyncReducer = getReducers();
    injectAsyncReducer(store, AsyncReducer);
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <h1>React Example</h1>
          <button onClick={() => { this.setState({ isShow: true }); }}>Click</button>
          {this.state.isShow ? <AirstoreUploader
            opened={true}
            initialOptions={AIRSTORE_CONFIG}
          /> : null}
        </div>
      </Provider>
    )
  }
}

render(<App/>, document.getElementById('airstore-uploader'));