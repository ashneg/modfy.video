import { observable, action, computed } from 'mobx';

import formats from '../dist/formats';

import TerminalStore from './terminalStore';

class FileStore {
  @observable oldFiles: Array<string> = [];

  @observable terminalStore = TerminalStore;

  @observable currentFileName: string = '';

  @action
  updateCurrentFile = (fileName: string) => {
    this.oldFiles.push(this.currentFileName);
    this.currentFileName = fileName;
  };

  @observable files: { uploaded: boolean; values: File[] } = { uploaded: false, values: [] };

  renameFile = (originalFile: File, count: number, extension: string) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    new File([originalFile], `input-${count}.${extension}`, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });

  @action('Update Files')
  updateFiles = (value: File[]) => {
    if (value.length > 0) {
      const renamedFiles: File[] = [];
      let count = 0;
      for (const file of value) {
        const { name, size } = file;
        if (this.terminalStore && this.terminalStore.updateTerminalText) {
          this.terminalStore.updateTerminalText(`Received File ${name}`);
        }
        const nameComponents = name.split('.');
        const ext = nameComponents[nameComponents.length - 1];
        renamedFiles.push(this.renameFile(file, count, ext));
        count += 1;
      }
      Object.assign(this.files, { uploaded: true, values: renamedFiles });
      console.info(renamedFiles, JSON.stringify(this.files));
      if (this.terminalStore && this.terminalStore.updateTerminalText) {
        this.terminalStore.updateTerminalText(
          'This is a CLUI, a Command Line Graphical Interface, it will help you choose you settings.',
          true
        );
      }
    }
  };

  /**
   * Returns current file extension **without the dot**
   * Example mov, mp4
   */
  @computed get currentFileExtension() {
    const { currentFileName } = this;
    const nameArray = currentFileName.split('.');
    const ext = nameArray[nameArray.length - 1];
    return ext;
  }

  /**
   * Returns a computed string for blobType which takes the value of the current file extension
   * and return `video/$ext`. An example would be for an test.mov file it returns `video/mov`
   */
  @computed get defaultBlobType() {
    const { currentFileExtension } = this;
    const blobType = `video/${currentFileExtension}`;
    return blobType;
  }

  /**
   * Returns if the current file extension is displayable or not,
   * i.e, can the browser video tag support this extension
   */
  @computed get isDisplayable() {
    const ext = `.${this.currentFileExtension}`;

    console.info('Current file extension', ext);

    for (const key of Object.keys(formats)) {
      const currentFormat = formats[key];
      if (currentFormat.extension === ext) {
        return currentFormat.display;
      }
    }
    return false;
  }

  getFileExtension = (fileName: string) => {
    const filePathArr = fileName.split('.');
    return filePathArr[filePathArr.length - 1];
  };

  sizeHumanReadable = (inputSize: number) => {
    let fileSize = inputSize;
    const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
    let i = 0;
    while (fileSize > 900) {
      fileSize /= 1024;
      i += 1;
    }
    const exactSize = `${Math.round(fileSize * 100) / 100} ${fSExt[i]}`;
    return exactSize;
  };

  @computed get fileData() {
    const { files, getFileExtension, sizeHumanReadable } = this;
    const fileData: Array<{ size: string; ext: string }> = files.values.map((file) => ({
      size: sizeHumanReadable(file.size),
      ext: getFileExtension(file.name),
    }));
    return fileData;
  }
}

export default new FileStore();
