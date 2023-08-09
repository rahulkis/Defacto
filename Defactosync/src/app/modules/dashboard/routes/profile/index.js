import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "../../../../../util/IntlMessages";
import timezones from "../../../../../jsonData/timezone";
import { PROFILE_URLS } from "../../../../../constants/AppConst";
import { httpClient } from "../../../../../appUtility/Api";
import {
  b64toBlob,
  UploadImage,
} from "../../../../../appUtility/commonFunction";
import { updateAuthUserName } from "actions/Auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { ToastsStore } from "react-toasts";
import CircularProgress from "@material-ui/core/CircularProgress";
import "../../../../../assets/customs/profile.css";
import { AWS_BUCKET } from "../../../../../constants/AppConst";

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Name Required")
    .matches(
      /^[^-\s][a-zA-Z0-9_\s-]+$/,
      "Name should not start with whitespace"
    ),
});

class Profile extends React.Component {
  constructor(prop) {
    super();
    this.state = {
      email: "",
      password: "",
      fullName: "",
      role: "",
      company: "",
      timeZone: "",
      isLoading: false,
      profileName: "",
      imageName: "",
      imgSrc: "",
      fileName: "",
      imgChanges: false,
    };
  }
  
  componentDidMount() {
    document.title = 'FormSync - Profile';
    const {
      email,
      password,
      fullName,
      role,
      imageName,
      company,
      timeZone,
    } = this.props.authUser;

    console.log("sss", this.props.authUser);
    this.setState({
      email: email,
      password: password,
      fullName: fullName,
      role: role,
      imageName: imageName,
      company: company,
      timeZone: timeZone,
    });

    if (fullName) {
      let name = fullName.split(" ");
      if (name.length > 1) {
        this.setState({
          profileName: name[0].charAt(0) + name[1].charAt(0),
        });
      } else {
        this.setState({
          profileName: name[0].charAt(0),
        });
      }
    }
  }

  getUserDetail() {
    try {
      const token = localStorage.getItem("tokens");
      const userId = localStorage.getItem("login_user")
        ? JSON.parse(localStorage.getItem("login_user")).id
        : "";
      if (token && userId) {
        this.setState({ isLoading: true });
        httpClient
          .get(PROFILE_URLS.PROFILE_BY_ID + userId)
          .then((res) => {
            let result = res.data.data;
            if (result) {
              localStorage.setItem("login_user", JSON.stringify(result));
              const newUpdate = {
                ...result,
                token: JSON.parse(token),
              };
              this.props.updateAuthUserName(newUpdate);
            }
            this.setState({ isLoading: false });
          })
          .catch((err) => {
            ToastsStore.error("Something Went wrong");
            this.setState({ isLoading: false });
          });
      }
    } catch (error) {
      ToastsStore.error("Something Went wrong");
      this.setState({ isLoading: false });
    }
  }

  handleProfileUpdate = (values) => {
    this.setState({ isLoading: true });
    try {
      let userId = this.props.authUser.id;

      if (userId) {
        let body = {
          id: userId,
          fullName: values.fullName ? values.fullName : "",
          company: values.company ? values.company : "",
          role: values.role ? values.role : "",
          timeZone: values.timeZone ? values.timeZone : "",
          imageName: values.imageName ? values.imageName : "",
          updatedBy: userId,
        };
        httpClient
          .post(PROFILE_URLS.UPDATE_PROFILE_INFO, body)
          .then((res) => {
            if (res.data.statusCode === 200) {
              this.getUserDetail();
              ToastsStore.success("profile updated");
            } else {
              ToastsStore.error("Something went wrong");
            }
            this.setState({ isLoading: false });
          })
          .catch((err) => {
            this.setState({ isLoading: false });
            ToastsStore.error("Something went wrong");
          });
      }
    } catch (error) {
      this.setState({ isLoading: false });
      ToastsStore.error("Something went wrong");
    }
  };

  handleProfileImageUpload = async (binaryData, fileName) => {
    this.setState({ isLoading: true });
    try {
      let blob = b64toBlob(binaryData[0]);
      let file = new File([blob], fileName, {
        type: "image/jpeg",
      });

      let result = await UploadImage(file, AWS_BUCKET.USERIMAGES);

      return result;
    } catch (error) {
      ToastsStore.error("Something went wrong");
      return false;
    }
  };

  _onChange = async (e) => {
    let userId = JSON.parse(localStorage.getItem("login_user")).id;
    var file = this.refs.file.files[0];
    if (file !== undefined) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function(e) {
        this.setState({
          imgChanges: true,
          imgSrc: [reader.result],
          fileName: file.name.split(".")[0] + "_" + userId + ".jpeg",
        });
      }.bind(this);
    }
  };

  render() {
    const {
      email,    
      fullName,
      role,
      company,
      timeZone,
      isLoading,
      profileName,
      imageName,
      imgSrc,
      fileName,
      imgChanges,
    } = this.state;
    console.log("imageName", this.state);
    return (
      <div className="dashboard animated slideInUpTiny animation-duration-3">
        <ContainerHeader
          match={this.props.match}
          title={<IntlMessages id="sidebar.profile" />}
        />

        <div className="card">
          <div className="card-header">
            <div className="row">
              {!imageName ? (
                <div className="row">
                  {!imgSrc ? (
                    <div id="profileName">{profileName}</div>
                  ) : (
                    <img id="profileImage" src={imgSrc} alt="profileimage" />
                  )}
                </div>
              ) : (
                <div>
                  {!imgChanges ? (
                    <img
                      id="profileImage"
                      // src={APP_IMAGE_URL + "UserImages/" + imageName}
                      src="https://i.picsum.photos/id/477/200/300.jpg?hmac=Y-uy4_ZZZ6HOZCxdiN04OOypBZ3y2dY2gAfu9MvZMSE"
                      alt="profileimage"
                    />
                  ) : (
                    <img id="profileImage" src={imgSrc} alt="profileimage" />
                  )}
                </div>
              )}
              <div className="float-right">
                <input
                  id="upload-1"
                  type="file"
                  ref="file"
                  accept="image/*"
                  className="invisible"
                  onChange={this._onChange}
                />
                <label
                  htmlFor="upload-1"
                  id="profilImagebtn"
                  className="btn btn-success btn-lg"
                >
                  Upload Image
                </label>
              </div>
            </div>
          </div>
          <div className="card-body">
            <Formik
              enableReinitialize
              initialValues={{
                email: email,
                password: "****************",
                fullName: fullName,
                company: company,
                role: role,
                timeZone: timeZone,
                imageName: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                if (imgSrc && fileName) {
                  let result = await this.handleProfileImageUpload(
                    imgSrc,
                    fileName
                  );
                  if (result) {
                    values.imageName = fileName;
                  }
                } else {
                  values.imageName = imageName;
                }
                this.handleProfileUpdate(values);
              }}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <fieldset>
                    <div className="form-group">
                      <label className="requiredFields">
                        {<IntlMessages id="appModule.email" />}
                      </label>
                      <input
                        className="form-control"
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        readOnly
                      />
                    </div>

                    <div className="form-group">
                      <label className="requiredFields">Password</label>
                      <div className="input-group md-form form-sm form-2 pl-0">
                        <input
                          className="form-control my-0 py-1 red-border"
                          type="password"
                          onChange={handleChange}
                          value={values.password}
                          name="password"
                          readOnly
                        />
                        <div className="input-group-append">
                          <span
                            className="input-group-text red lighten-3"
                            id="basic-text1"
                          >
                            <Link
                              className="btn btn-sm"
                              to="/app/profile-changepassword"
                            >
                              CHANGE PASSWORD
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>

                    {isLoading && (
                      <div id="profileLoader" >
                        <CircularProgress />
                      </div>
                    )}

                    <div className="form-group">
                      <label className="requiredFields">Full Name</label>
                      <input
                        className="form-control"
                        onChange={handleChange}
                        value={values.fullName}
                        name="fullName"
                      />
                      <p className="error"> {errors.fullName}</p>
                    </div>

                    <div className="form-group">
                      <label>Company</label>
                      <input
                        className="form-control"
                        onChange={handleChange}
                        value={values.company}
                        name="company"
                      />
                    </div>

                    <div className="form-group">
                      <label>Role</label>
                      <select
                        onChange={handleChange}
                        value={values.role}
                        name="role"
                        className="form-control"
                      >
                        <option value="user">User</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Timezone</label>
                      <select
                        className="form-control"
                        onChange={handleChange}
                        value={values.timeZone}
                        name="timeZone"
                      >
                        {timezones.map((timezone) => (
                          <option key={timezone} value={timezone}>
                            {timezone}
                          </option>
                        ))}
                      </select>
                      <p>Used when we handle time with no explicit timezone.</p>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-lg float-right"
                      disabled={isLoading}
                    >
                      Save changes
                    </button>
                  </fieldset>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser } = auth;
  return { authUser };
};

export default connect(mapStateToProps, { updateAuthUserName })(Profile);
