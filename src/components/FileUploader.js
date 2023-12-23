import { GridLoader } from "halogenium";
import React from "react";
import {
  ButtonGroup,
  CardBody,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { getPreviewByFileName } from "./Common";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FileUploaderCls extends React.Component {
  static defaultProps = {
    maxFileSize: 10240,
    modalSize: "lg",
  };

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data ? this.props.data : {},
      isDragging: false,
      isReading: false,
      showModal: false,
      showPreview: true,
    };
  }

  componentDidMount() {
    if (!this.props.disabled) {
      document.addEventListener(
        "dragover",
        (event) => {
          event.preventDefault();
        },
        false
      );
      document.addEventListener(
        "drop",
        (event) => {
          event.preventDefault();
        },
        false
      );
      this.container.addEventListener(
        "drop",
        (event) => {
          event.preventDefault();
          this.onUpload(event.dataTransfer.files);
        },
        false
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.data.file != null &&
      nextProps.data.fileName != null &&
      nextProps.data.mimeType != null
    ) {
      this.setState({ data: nextProps.data });
    } else if (nextProps.data.file == null) {
      if (nextProps.data != null) {
        this.setState({
          data: {
            file: nextProps.data,
            fileName: "",
            mimeType: "",
          },
        });
      } else this.setState({ data: {} });
    }
  }

  openModal = () => {
    this.setState({ showModal: true });
  };

  getByteLen = (stringData) => {
    stringData = String(stringData);
    var byteLen = 0;
    for (var i = 0; i < stringData.length; i++) {
      var c = stringData.charCodeAt(i);
      byteLen +=
        c < 1 << 7
          ? 1
          : c < 1 << 11
          ? 2
          : c < 1 << 16
          ? 3
          : c < 1 << 21
          ? 4
          : c < 1 << 26
          ? 5
          : c < 1 << 31
          ? 6
          : Number.NaN;
    }

    return byteLen;
  };

  onImageRemove = () => {
    var data = {
      file: "",
      fileName: "",
      mimeType: "",
    };
    this.setState({ data: data });
    if (this.props.onChange)
      this.props.onChange(this.props.mode == "base64" ? data.file : data);
  };

  onDownload = () => {
    var element = document.createElement("a");
    element.setAttribute("href", this.getDataUrl());
    element.setAttribute("download", this.state.data.fileName);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  onUpload = (files) => {
    this.readData(files[0]);
    this.logoInput.value = "";
  };

  readData = (file) => {
    if (this.props.maxFileSize)
      if (file && file.size / 1024 > this.props.maxFileSize) {
        return;
      }

    if (file !== undefined) this.setState({ isReading: true });
    let reader = new FileReader();

    reader.onloadend = (event) => {
      if (reader.error) {
        console.error("error", reader.error);
        this.logoInput.value = "";
        return;
      }
      var data = {
        file: reader.result.split(",")[1],
        fileName: file.name,
        mimeType: file.type,
      };

      this.setState({ data: data }, () =>
        setTimeout(() => this.setState({ isReading: false }), 500)
      );
      if (this.props.onChange)
        this.props.onChange(this.props.mode == "base64" ? data.file : data);
    };
    if (file !== undefined) reader.readAsDataURL(file);
  };

  readerHandler = (event) => {
    // console.log('got event: ' + event.type);
  };

  getFileSizeText = (nBytes) => {
    if (nBytes == 0) return "";

    //TODO fix
    nBytes = nBytes * 0.75;

    var sOutput = nBytes + " bytes";
    for (
      var aMultiples = ["KB", "MB", "GB"],
        nMultiple = 0,
        nApprox = nBytes / 1024;
      nApprox > 1 && nMultiple < 3;
      nApprox /= 1024, nMultiple++
    ) {
      sOutput = nApprox.toFixed(1) + " " + aMultiples[nMultiple];
    }
    return " (" + sOutput + ")";
  };

  getDataUrl = () =>
    "data:" +
    (this.state.data.mimeType ? this.state.data.mimeType : "image/png") +
    `;base64,${this.state.data.file}`;

  renderPreview = () => {
    if (
      this.state.data.file != null &&
      this.state.data.file != "" &&
      this.state.data.mimeType.startsWith("image/") &&
      this.state.data.mimeType != "image/tiff"
    )
      return this.getDataUrl();
    else
      return getPreviewByFileName(
        this.state.data.fileName,
        false,
        this.props.mode == "base64",
        this.state.data.file != null && this.state.data.file != ""
      );
  };

  handleTogglePreview = () => {
    const { showPreview } = this.state;
    this.setState({
      showPreview: showPreview === true ? false : true,
    });
  };

  render() {
    return (
      <div
        ref={(ref) => {
          this.container = ref;
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e4e7ea",
            borderRadius: 5,
            padding: 5,
            cursor: this.props.disabled ? "not-allowd" : "pointer",
            opacity: this.props.disabled ? 0.65 : undefined,
            overflow: "hidden",
            
            ...this.props.style,
          }}
        >
          <input
            type="file"
            style={{ display: "none" }}
            disabled={this.props.disabled}
            accept={this.props.accept}
            onChange={(t) => this.onUpload(t.target.files)}
            ref={(ref) => {
              this.logoInput = ref;
            }}
          />
          <Row>
            <Col md={12} lg={6}>
              <ButtonGroup size="md" style={{ width: "100%", marginBottom: 5 }}>
                <Button
                  variant="success"
                  disabled={this.state.isReading || this.props.disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    if (this.logoInput) this.logoInput.click();
                  }}
                >
                  DOSYA
                </Button>
                <Button
                  variant="warning"
                  disabled={
                    this.state.isReading ||
                    this.state.data.file == null ||
                    this.state.data.file == ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleTogglePreview();
                  }}
                >
                  GÖSTER
                </Button>
              </ButtonGroup>
            </Col>
            <Col md={12} lg={6}>
              <ButtonGroup size="md" style={{ width: "100%", marginBottom: 5 }}>
                <Button
                  variant="primary"
                  disabled={
                    this.state.isReading ||
                    this.state.data.file == null ||
                    this.state.data.file == ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    this.onDownload();
                  }}
                >
                  INDIR
                  {/*TODO  <Icon style={{ color: '#3DD1A6', fontSize: 19 }} glyph='icon-stroke-gap-icons-Download' /> */}
                </Button>
                <Button
                  variant="danger"
                  disabled={this.state.isReading || this.props.disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    this.onImageRemove();
                  }}
                >
                  SIL
                </Button>
              </ButtonGroup>
            </Col>
          </Row>

          <CardBody
            style={{
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {this.state.isReading ? (
              <div
                style={{
                  position: "absolute",
                  top: "calc(50% - 20px)",
                  left: "calc(50% - 30px)",
                }}
              >
                <GridLoader color="#28C0DA" />
              </div>
            ) : null}
            {this.state.showPreview ? (
              <img
                src={this.renderPreview()}
                alt={this.state.data.fileName}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  maxHeight: 150,
                  padding: 10,
                  opacity: this.state.isReading ? 0.2 : 1,
                  cursor: "zoom-in",
                  ...this.props.imageStyle,
                }}
                onClick={() =>
                  this.setState({
                    showModal: this.state.data.fileName ? true : false,
                  })
                }
              />
            ) : null}
            <span>
              {this.state.data.fileName != null &&
              this.state.data.fileName != ""
                ? this.state.data.fileName + " "
                : null}
              {this.getFileSizeText(this.getByteLen(this.state.data.file))}
            </span>
          </CardBody>
        </div>

        <Modal
          isOpen={this.state.showModal}
          toggle={() => this.setState({ showModal: false })}
          size={this.props.modalSize}
          centered={true}
        >
          <ModalHeader>
            <Label>{this.state.data.fileName}</Label>
          </ModalHeader>
          <ModalBody>
            {this.state.showPreview ? (
              <object
                style={{
                  resizeMode: "contain",
                  width: "100%",
                  minHeight: "70vh",
                }}
                data={
                  this.state.data.mimeType != "text/xml" && this.getDataUrl()
                }
                /* type={this.state.data.mimeType} */
              >
                <img
                  src={this.renderPreview()}
                  alt={this.state.data.fileName}
                ></img>
              </object>
            ) : null}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
