import React from "react";
import "react-toggle/style.css";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import FileUploaderCls from "./components/FileUploader";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      tempFile: {
        file: "",
        fileName: "",
        mimeType: "",
        fileDesc: "",
        isModalVisible: false,
      },
      toggle: false,
      showBodyStatus: false,
    };
  }

  onUpload = (toggle) => {
    console.log("tempFile", this.state.tempFile);
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ margin: 10, width: 515 }}>
          <div className="file-uploader p-2">
            <FileUploaderCls
              accept=".pdf"
              data={this.state.tempFile}
              style={{ width: "500px" }}
              onChange={(data) => this.setState({ tempFile: data })}
            />
          </div>
          <div className="upload-btn p-2 float-end">
            <Button
              color="primary"
              disabled={
                Object.keys(this.state.tempFile).length === 0 ||
                this.state.tempFile.file === ""
              }
              onClick={() => this.onUpload(this.state.toggle)}
              href="#"
            >
              YÜKLE
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
