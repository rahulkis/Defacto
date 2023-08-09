import { PostData } from './requests';
import { SEND_EMAIL_URL } from '../constants/AppConst'
import {ToastsStore} from 'react-toasts';

export async function SendEmail(ToAddresses, Subject, BodyText) {

  let FormModel = {
    ToAddresses: ToAddresses,
    BodyText: BodyText,
    Subject: Subject,
  };

  try {
    await PostData(SEND_EMAIL_URL, FormModel).then(res => {
      console.log(res);
    })
  } catch (err) {
    return err;
  }
}

export async function sendVerificationEmail(userEmail, emailTemplate) {

  let subject = 'Email Verification';
  let FormModel = {
    ToAddresses: userEmail,
    BodyText: emailTemplate,
    Subject: subject,
  };

  try {
    await PostData(SEND_EMAIL_URL, FormModel).then(res => {
      console.log(res);
      if(res.statusCode === 200){
        setTimeout(() => {
          ToastsStore.success("You have registered successfully. Please check you email for verification")
        }, 2000)
      } else {
        // ToastsStore.error(res.data.message);
      }
    })
  } catch (err) {
    return err;
  }
}

