import VectorMap from "views/maps/VectorMap.jsx";
import GoogleMaps from "views/maps/GoogleMaps.jsx";
import FullScreenMap from "views/maps/FullScreenMap.jsx";
import ReactTables from "views/tables/ReactTables.jsx";
import RegularTables from "views/tables/RegularTables.jsx";
import ExtendedTables from "views/tables/ExtendedTables.jsx";
import Wizard from "views/forms/Wizard.jsx";
import CreateForms from "views/forms/CreateForms.jsx";
import NewForm from "views/forms/NewForm.jsx";
import PreviewForm from "views/forms/PreviewForm.jsx";
import Invite from "views/forms/Invite.jsx";
import ValidationForms from "views/forms/ValidationForms.jsx";
import ExtendedForms from "views/forms/ExtendedForms.jsx";
import RegularForms from "views/forms/RegularForms.jsx";
import Calendar from "views/Calendar.jsx";
import Widgets from "views/Widgets.jsx";
import Charts from "views/Charts.jsx";
import Dashboard from "views/Dashboard.jsx";
import Buttons from "views/components/Buttons.jsx";
import SweetAlert from "views/components/SweetAlert.jsx";
import Notifications from "views/components/Notifications.jsx";
import Grid from "views/components/Grid.jsx";
import Typography from "views/components/Typography.jsx";
import Icons from "views/components/Icons.jsx";
import Pricing from "views/pages/Pricing.jsx";
import Register from "views/pages/Register.jsx";
import ForgotPassword from "views/pages/ForgotPassword.jsx";
import User from "views/pages/User.jsx";
import Login from "views/pages/Login.jsx";
import Rtl from "views/pages/Rtl.jsx";
import Lock from "views/pages/Lock.jsx";
import ViewForm from "views/forms/ViewForm.jsx";
import EditForm from "views/forms/EditForm.jsx";
import ConfigurePayment from "views/forms/ConfigurePayment.jsx";
import ConfigureEmail from "views/forms/AfterSubmissionForm/ConfigureEmail.jsx";
import ConfigureDetail from "views/forms/Configure/Details.jsx";
import Analytics from "views/forms/Configure/Analytics.jsx";
import FormBehaviour from "views/forms/Configure/FormBehaviour.jsx";
import SuccessRedirectPage from "views/forms/AfterSubmissionForm/SuccessRedirectPage.jsx";
import CustomPdf from "views/forms/AfterSubmissionForm/CustomPdf.jsx";
import PaymentIntegrations from "views/forms/PaymentIntegrations.jsx";
import Successful from "views/forms/Successful.jsx";
import Submission from "views/forms/Submission/Submission.jsx";
import SubmissionClosed from "views/forms/SubmissionClosed.jsx";
import TemplateView from "views/templates/TemplateView.jsx";
import TemplateList from "views/templates/TemplateList.jsx";
import ProjectDetail from "views/trackForm/projectDetail.jsx";
import TrackForm from "views/trackForm/Trackform.jsx";
import Social from "views/Social/Social.jsx";
import IntegrationNwebhooks from "views/forms/AfterSubmissionForm/IntegrationNwebhooks.jsx";
import HowToUseWebHooks from "views/forms/WebHooks/HowToUseWebHooks.jsx";
import VerifyUser from "views/forms/VerifyUser.jsx";
import ResetPassword from "views/forms/ResetPassword.jsx";
import Account from "views/AccountSettings/Account.jsx";
import AccountExpired from "views/AccountExpired.jsx";
import TwoFactorAuthentication from "views/AccountSettings/AccountInsidePages/2FA.jsx";
import TwoFactorVerification from "views/pages/TwoFactorAuthentication.jsx";
const routes = [
  {
    path: "",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/dashboard",
  },
  {
    path: "/accountExpired",
    name: "Account Expired",
    rtlName: "أشكال عادية",
    mini: "VU",
    rtlMini: "صو",
    component: AccountExpired,
    layout: "/preview",
  },
  {
    path: "/2fa",
    name: "2FA",
    rtlName: "أشكال عادية",
    mini: "VU",
    rtlMini: "صو",
    component: TwoFactorAuthentication,
    layout: "/preview",
  },
  {
    path: "",
    name: "projectDetail",
    component: ProjectDetail,
    layout: "/projectDetail",
  },
  {
    collapse: true,
    name: "Pages",
    rtlName: "صفحات",
    icon: "tim-icons icon-image-02",
    state: "pagesCollapse",
    views: [
      {
        path: "/pricing",
        name: "Pricing",
        rtlName: "عالتسعير",
        mini: "P",
        rtlMini: "ع",
        component: Pricing,
        layout: "/auth",
      },
      {
        path: "/rtl-support",
        name: "RTL Support",
        rtlName: "صودعم رتل",
        mini: "RS",
        rtlMini: "صو",
        component: Rtl,
        layout: "/rtl",
      },

      {
        path: "/login",
        name: "Login",
        rtlName: "هعذاتسجيل الدخول",
        mini: "L",
        rtlMini: "هعذا",
        component: Login,
        layout: "/auth",
      },
      {
        path: "/register",
        name: "Register",
        rtlName: "تسجيل",
        mini: "R",
        rtlMini: "صع",
        component: Register,
        layout: "/auth",
      },

      {
        path: "/lock-screen",
        name: "Lock Screen",
        rtlName: "اقفل الشاشة",
        mini: "LS",
        rtlMini: "هذاع",
        component: Lock,
        layout: "/auth",
      },
      {
        path: "/user-profile",
        name: "User Profile",
        rtlName: "ملف تعريفي للمستخدم",
        mini: "UP",
        rtlMini: "شع",
        component: User,
        layout: "/admin",
      },
      {
        path: "/2faVerification",
        name: "Two Factor Authentication",
        rtlName: "ملف تعريفي للمستخدم",
        mini: "UP",
        rtlMini: "شع",
        component: TwoFactorVerification,
        layout: "/preview",
      },
    ],
  },
  {
    collapse: true,
    name: "Components",
    rtlName: "المكونات",
    icon: "tim-icons icon-molecule-40",
    state: "componentsCollapse",
    views: [
      {
        collapse: true,
        name: "Multi Level Collapse",
        rtlName: "انهيار متعدد المستويات",
        mini: "MLT",
        rtlMini: "ر",
        state: "multiCollapse",
        views: [
          {
            path: "/buttons",
            name: "Buttons",
            rtlName: "وصفت",
            mini: "B",
            rtlMini: "ب",
            component: Buttons,
            layout: "/admin",
          },
        ],
      },
      {
        path: "/buttons",
        name: "Buttons",
        rtlName: "وصفت",
        mini: "B",
        rtlMini: "ب",
        component: Buttons,
        layout: "/admin",
      },
      {
        path: "/grid-system",
        name: "Grid System",
        rtlName: "نظام الشبكة",
        mini: "GS",
        rtlMini: "زو",
        component: Grid,
        layout: "/admin",
      },
      {
        path: "/sweet-alert",
        name: "Sweet Alert",
        rtlName: "الحلو تنبيه",
        mini: "SA",
        rtlMini: "ومن",
        component: SweetAlert,
        layout: "/admin",
      },
      {
        path: "/notifications",
        name: "Notifications",
        rtlName: "إخطارات",
        mini: "N",
        rtlMini: "ن",
        component: Notifications,
        layout: "/admin",
      },
      {
        path: "/icons",
        name: "Icons",
        rtlName: "الرموز",
        mini: "I",
        rtlMini: "و",
        component: Icons,
        layout: "/admin",
      },
      {
        path: "/typography",
        name: "Typography",
        rtlName: "طباعة",
        mini: "T",
        rtlMini: "ر",
        component: Typography,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Forms",
    rtlName: "إستمارات",
    icon: "tim-icons icon-notes",
    state: "formsCollapse",
    views: [
      {
        path: "/TemplateView",
        name: "View Template",
        rtlName: "أشكال عادية",
        mini: "SD",
        rtlMini: "صو",
        component: TemplateView,
        layout: "/Template",
      },
      {
        path: "/CreateForm",
        name: "Create Forms",
        rtlName: "أشكال عادية",
        mini: "CF",
        rtlMini: "صو",
        component: CreateForms,
        layout: "/user",
      },
      //TemplateView
      {
        path: "/Submission",
        name: "Submission Data",
        rtlName: "أشكال عادية",
        mini: "SD",
        rtlMini: "صو",
        component: Submission,
        layout: "/Submission",
      },

      {
        path: "/Account",
        name: "Account",
        component: Account,
        layout: "/AccountSettings",
      },

      {
        path: "/NewForm",
        name: "New Form",
        rtlName: "أشكال عادية",
        mini: "NF",
        rtlMini: "صو",
        component: NewForm,
        layout: "/user",
      },
      {
        path: "/PreviewForm/:formId",
        name: "Preview Form",
        rtlName: "أشكال عادية",
        mini: "PF",
        rtlMini: "صو",
        component: PreviewForm,
        layout: "/preview",
      },
      {
        path: "/Invite/:userId",
        name: "Invite",
        rtlName: "أشكال عادية",
        mini: "PF",
        rtlMini: "صو",
        component: Invite,
        layout: "/preview",
      },
      {
        path: "/VerifyUser/:userId",
        name: "Verify User",
        rtlName: "أشكال عادية",
        mini: "VU",
        rtlMini: "صو",
        component: VerifyUser,
        layout: "/preview",
      },
      {
        path: "/ResetPassword/:userData",
        name: "Reset Password",
        rtlName: "أشكال عادية",
        mini: "VU",
        rtlMini: "صو",
        component: ResetPassword,
        layout: "/preview",
      },
      {
        path: "/reset",
        name: "Forgot Password",
        rtlName: "هعذاتسجيل الدخول",
        mini: "RP",
        rtlMini: "هعذا",
        component: ForgotPassword,
        layout: "/auth",
      },
      {
        path: "/regular-forms",
        name: "Regular Forms",
        rtlName: "أشكال عادية",
        mini: "RF",
        rtlMini: "صو",
        component: RegularForms,
        layout: "/admin",
      },
      {
        path: "/extended-forms",
        name: "Extended Forms",
        rtlName: "نماذج موسعة",
        mini: "EF",
        rtlMini: "هوو",
        component: ExtendedForms,
        layout: "/admin",
      },
      {
        path: "/validation-forms",
        name: "Validation Forms",
        rtlName: "نماذج التحقق من الصحة",
        mini: "VF",
        rtlMini: "تو",
        component: ValidationForms,
        layout: "/admin",
      },
      {
        path: "/wizard",
        name: "Wizard",
        rtlName: "ساحر",
        mini: "W",
        rtlMini: "ث",
        component: Wizard,
        layout: "/admin",
      },
      {
        path: "/ViewForm",
        name: "View Form",
        rtlName: "أشكال عادية",
        mini: "PF",
        rtlMini: "صو",
        component: ViewForm,
        layout: "/preview",
      },
      {
        path: "/ConfigurePayment",
        name: "Configure Payment",
        rtlName: "أشكال عادية",
        mini: "CP",
        rtlMini: "صو",
        component: ConfigurePayment,
        layout: "/user",
      },
      {
        path: "/ConfigureEmail",
        name: "Configure Emails",
        rtlName: "أشكال عادية",
        mini: "CP",
        rtlMini: "صو",
        component: ConfigureEmail,
        layout: "/user",
      },
      {
        path: "/PaymentIntegrations",
        name: "PaymentIntegrations",
        rtlName: "",
        mini: "PI",
        rtlMini: "",
        component: PaymentIntegrations,
        layout: "/user",
      },
      {
        path: "/Successful",
        name: "Successful",
        rtlName: "",
        mini: "PI",
        rtlMini: "",
        component: Successful,
        layout: "/user",
      },
      {
        path: "/EditForm",
        name: "Edit Form",
        rtlName: "أشكال عادية",
        mini: "PF",
        rtlMini: "صو",
        component: EditForm,
        layout: "/user",
      },
      {
        path: "/SuccessRedirectPage",
        name: "Success Page & Redirects",
        rtlName: "أشكال عادية",
        mini: "CP",
        rtlMini: "صو",
        component: SuccessRedirectPage,
        layout: "/user",
      },
      {
        path: "/custompdf",
        name: "CustomPdf",
        rtlName: "أشكال عادية",
        mini: "CP",
        rtlMini: "صو",
        component: CustomPdf,
        layout: "/user",
      },
      {
        path: "/ConfigureDetail",
        name: "ConfigureDetail",
        rtlName: "",
        mini: "PI",
        rtlMini: "",
        component: ConfigureDetail,
        layout: "/user",
      },
      {
        path: "/Analytics",
        name: "Analytics",
        rtlName: "",
        mini: "An",
        rtlMini: "",
        component: Analytics,
        layout: "/user",
      },
      {
        path: "/FormBehaviour",
        name: "FormBehaviour",
        rtlName: "",
        mini: "FB",
        rtlMini: "",
        component: FormBehaviour,
        layout: "/user",
      },
      {
        path: "/SubmissionClosed",
        name: "SubmissionClosed",
        rtlName: "",
        mini: "SC",
        rtlMini: "",
        component: SubmissionClosed,
        layout: "/preview",
      },
      {
        path: "/IntegrationNwebhooks",
        name: "IntegrationNwebhooks",
        rtlName: "",
        mini: "INWH",
        rtlMini: "",
        component: IntegrationNwebhooks,
        layout: "/user",
      },
      {
        path: "",
        name: "trackForm",
        component: TrackForm,
        layout: "/trackForm",
      },
      {
        path: "/HowToUseWebHooks",
        name: "How To Use WebHooks",
        rtlName: "",
        mini: "HTUWH",
        rtlMini: "",
        component: HowToUseWebHooks,
        layout: "/articles",
      },
    ],
  },
  {
    collapse: true,
    name: "Tables",
    rtlName: "الجداول",
    icon: "tim-icons icon-puzzle-10",
    state: "tablesCollapse",
    views: [
      {
        path: "/regular-tables",
        name: "Regular Tables",
        rtlName: "طاولات عادية",
        mini: "RT",
        rtlMini: "صر",
        component: RegularTables,
        layout: "/admin",
      },
      {
        path: "/extended-tables",
        name: "Extended Tables",
        rtlName: "جداول ممتدة",
        mini: "ET",
        rtlMini: "هور",
        component: ExtendedTables,
        layout: "/admin",
      },
      {
        path: "/react-tables",
        name: "React Tables",
        rtlName: "رد فعل الطاولة",
        mini: "RT",
        rtlMini: "در",
        component: ReactTables,
        layout: "/admin",
      },
    ],
  },
  {
    collapse: true,
    name: "Maps",
    rtlName: "خرائط",
    icon: "tim-icons icon-pin",
    state: "mapsCollapse",
    views: [
      {
        path: "/google-maps",
        name: "Google Maps",
        rtlName: "خرائط جوجل",
        mini: "GM",
        rtlMini: "زم",
        component: GoogleMaps,
        layout: "/admin",
      },
      {
        path: "/full-screen-map",
        name: "Full Screen Map",
        rtlName: "خريطة كاملة الشاشة",
        mini: "FSM",
        rtlMini: "ووم",
        component: FullScreenMap,
        layout: "/admin",
      },
      {
        path: "/vector-map",
        name: "Vector Map",
        rtlName: "خريطة المتجه",
        mini: "VM",
        rtlMini: "تم",
        component: VectorMap,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/widgets",
    name: "Widgets",
    rtlName: "الحاجيات",
    icon: "tim-icons icon-settings",
    component: Widgets,
    layout: "/admin",
  },
  {
    path: "/TemplateView",
    name: "View Template",
    rtlName: "أشكال عادية",
    mini: "SD",
    rtlMini: "صو",
    component: TemplateView,
    layout: "/Template",
  },
  {
    path: "/TemplateList",
    name: "Template List",
    rtlName: "أشكال عادية",
    mini: "SD",
    rtlMini: "صو",
    component: TemplateList,
    layout: "/Template",
  },
  {
    path: "/charts",
    name: "Charts",
    rtlName: "الرسوم البيانية",
    icon: "tim-icons icon-chart-bar-32",
    component: Charts,
    layout: "/admin",
  },
  {
    path: "/calendar",
    name: "Calendar",
    rtlName: "التقويم",
    icon: "tim-icons icon-time-alarm",
    component: Calendar,
    layout: "/admin",
  },
  {
    path: "/Social",
    name: "Social",
    rtlName: "أشكال عادية",
    mini: "SO",
    rtlMini: "صو",
    component: Social,
    layout: "/user",
  },
];

export default routes;
