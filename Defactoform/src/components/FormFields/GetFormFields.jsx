import React from "react";
import InputControlField from "./InputField";
import RadioButtons from "./RadioButtons";

class GetFormFields extends React.Component {
  constructor(props) {
    super(props);
    this.Props = props; //controlType
    this.inpHTML = "";
  }

  componentWillMount() {
    console.log(this.Props);
  }

  getControls() {
    let controlType = this.Props.controlType;
    console.log(this.Props);
    //let inpHTML = "";
    switch (controlType) {
      case "":
        this.inpHTML = <InputControlField type="text" />;
        return this.inpHTML;
      case "email":
        this.inpHTML = (
          <InputControlField
            type="email"
            name="email"
            size="30"
            placeholder="Email required"
          />
        );
        // return <InputControlField type = "email"  name="email"  size="30" placeholder="Email required"/>;
        return this.inpHTML;
      case "url":
        this.inpHTML = (
          <InputControlField type="text" name="url" size="30" required="true" />
        );
        return this.inpHTML;
      case "yesno":
        this.inpHTML = (
          <div className="YesNo">
            <RadioButtons
              class="btn-raised btn-primary"
              type="radio"
              name="yesnoRadio"
              value="Yes"
              labelval="Yes"
            />
            <RadioButtons
              class="btn-raised btn-primary"
              type="radio"
              name="yesnoRadio"
              value="No"
              labelval="No"
            />
            {/* <label class="btn-raised btn-primary">Yes<input type="radio" name="yesnoRadio" value="Yes"></label>
            <label class="btn-raised btn-default">No<input type="radio" name="yesnoRadio" value="No"></label> */}
          </div>
        );
        return this.inpHTML;
      case "number":
        this.inpHTML = (
          <InputControlField
            type="text"
            name="dsfsa"
            pattern="[0-9]*"
            size="30"
            required="true"
          />
        );
        return this.inpHTML;
      case "phonenumber":
        this.inpHTML = (
          <InputControlField
            type="tel"
            name="addd"
            autocomplete="tel"
            lass="LiveField__input"
            placeholderchar="x"
            size="30"
            required="true"
          />
        );
        return this.inpHTML;
      case "address":
        this.inpHTML = `<div>
            <div class="address_left">
              <label class="address" for="Street*">Street*</label>
              <input type="text" label="Street*" name="Street*">
            </div>
            <div class="address_right"><label class="address" for="City/Suburb">City/Suburb</label>
            <input type="text" label="City/Suburb" name="City/Suburb">
            </div>
            <div class="Address__input Address__input--error address_left">
            <label class="address" for="State*">State*</label>
            <input type="text" label="State*" name="State*">
            </div>
            <div class="address_right">
            <label class="address" for="Zip/Post Code*">Zip/Post Code*</label>
            <input type="text" label="Zip/Post Code*" name="Zip/Post Code*">
            </div>
            <div class="country_select">
            <label class="address" for="Country*">Country*</label>
            <select label="Country*" name="Country*">
              <option></option><option>Afghanistan</option><option>Åland Islands</option><option>Albania</option><option>Algeria</option><option>American Samoa</option><option>Andorra</option><option>Angola</option><option>Anguilla</option><option>Antarctica</option><option>Antigua and Barbuda</option><option>Argentina</option><option>Armenia</option><option>Aruba</option><option>Australia</option><option>Austria</option><option>Azerbaijan</option><option>Bahamas</option><option>Bahrain</option><option>Bangladesh</option><option>Barbados</option><option>Belarus</option><option>Belgium</option><option>Belize</option><option>Benin</option><option>Bermuda</option><option>Bhutan</option><option>Bolivia</option><option>Bosnia and Herzegovina</option><option>Botswana</option><option>Bouvet Island</option><option>Brazil</option><option>British Indian Ocean Territory</option><option>Brunei Darussalam</option><option>Bulgaria</option><option>Burkina Faso</option><option>Burundi</option><option>Cambodia</option><option>Cameroon</option><option>Canada</option><option>Cape Verde</option><option>Cayman Islands</option><option>Central African Republic</option><option>Chad</option><option>Chile</option><option>China</option><option>Christmas Island</option><option>Cocos (Keeling) Islands</option><option>Colombia</option><option>Comoros</option><option>Congo</option><option>Congo, The Democratic Republic of the</option><option>Cook Islands</option><option>Costa Rica</option><option>Cote D'Ivoire</option><option>Croatia</option><option>Cuba</option><option>Cyprus</option><option>Czech Republic</option><option>Denmark</option><option>Djibouti</option><option>Dominica</option><option>Dominican Republic</option><option>Ecuador</option><option>Egypt</option><option>El Salvador</option><option>Equatorial Guinea</option><option>Eritrea</option><option>Estonia</option><option>Ethiopia</option><option>Falkland Islands (Malvinas)</option><option>Faroe Islands</option><option>Fiji</option><option>Finland</option><option>France</option><option>French Guiana</option><option>French Polynesia</option><option>French Southern Territories</option><option>Gabon</option><option>Gambia</option><option>Georgia</option><option>Germany</option><option>Ghana</option><option>Gibraltar</option><option>Greece</option><option>Greenland</option><option>Grenada</option><option>Guadeloupe</option><option>Guam</option><option>Guatemala</option><option>Guernsey</option><option>Guinea</option><option>Guinea-Bissau</option><option>Guyana</option><option>Haiti</option><option>Heard Island and Mcdonald Islands</option><option>Holy See (Vatican City State)</option><option>Honduras</option><option>Hong Kong</option><option>Hungary</option><option>Iceland</option><option>India</option><option>Indonesia</option><option>Iran, Islamic Republic Of</option><option>Iraq</option><option>Ireland</option><option>Isle of Man</option><option>Israel</option><option>Italy</option><option>Jamaica</option><option>Japan</option><option>Jersey</option><option>Jordan</option><option>Kazakhstan</option><option>Kenya</option><option>Kiribati</option><option>Korea, Democratic People'S Republic of</option><option>Korea, Republic of</option><option>Kuwait</option><option>Kyrgyzstan</option><option>Lao People'S Democratic Republic</option><option>Latvia</option><option>Lebanon</option><option>Lesotho</option><option>Liberia</option><option>Libyan Arab Jamahiriya</option><option>Liechtenstein</option><option>Lithuania</option><option>Luxembourg</option><option>Macao</option><option>Macedonia, The Former Yugoslav Republic of</option><option>Madagascar</option><option>Malawi</option><option>Malaysia</option><option>Maldives</option><option>Mali</option><option>Malta</option><option>Marshall Islands</option><option>Martinique</option><option>Mauritania</option><option>Mauritius</option><option>Mayotte</option><option>Mexico</option><option>Micronesia, Federated States of</option><option>Moldova, Republic of</option><option>Monaco</option><option>Mongolia</option><option>Montserrat</option><option>Morocco</option><option>Mozambique</option><option>Myanmar</option><option>Namibia</option><option>Nauru</option><option>Nepal</option><option>Netherlands</option><option>Netherlands Antilles</option><option>New Caledonia</option><option>New Zealand</option><option>Nicaragua</option><option>Niger</option><option>Nigeria</option><option>Niue</option><option>Norfolk Island</option><option>Northern Mariana Islands</option><option>Norway</option><option>Oman</option><option>Pakistan</option><option>Palau</option><option>Palestinian Territory, Occupied</option><option>Panama</option><option>Papua New Guinea</option><option>Paraguay</option><option>Peru</option><option>Philippines</option><option>Pitcairn</option><option>Poland</option><option>Portugal</option><option>Puerto Rico</option><option>Qatar</option><option>Reunion</option><option>Romania</option><option>Russian Federation</option><option>RWANDA</option><option>Saint Helena</option><option>Saint Kitts and Nevis</option><option>Saint Lucia</option><option>Saint Pierre and Miquelon</option><option>Saint Vincent and the Grenadines</option><option>Samoa</option><option>San Marino</option><option>Sao Tome and Principe</option><option>Saudi Arabia</option><option>Senegal</option><option>Serbia and Montenegro</option><option>Seychelles</option><option>Sierra Leone</option><option>Singapore</option><option>Slovakia</option><option>Slovenia</option><option>Solomon Islands</option><option>Somalia</option><option>South Africa</option><option>South Georgia and the South Sandwich Islands</option><option>South Sudan</option><option>Spain</option><option>Sri Lanka</option><option>Sudan</option><option>Suriname</option><option>Svalbard and Jan Mayen</option><option>Swaziland</option><option>Sweden</option><option>Switzerland</option><option>Syrian Arab Republic</option><option>Taiwan</option><option>Tajikistan</option><option>Tanzania, United Republic of</option><option>Thailand</option><option>Timor-Leste</option><option>Togo</option><option>Tokelau</option><option>Tonga</option><option>Trinidad and Tobago</option><option>Tunisia</option><option>Turkey</option><option>Turkmenistan</option><option>Turks and Caicos Islands</option><option>Tuvalu</option><option>Uganda</option><option>Ukraine</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option><option>United States Minor Outlying Islands</option><option>Uruguay</option><option>Uzbekistan</option><option>Vanuatu</option><option>Venezuela</option><option>Viet Nam</option><option>Virgin Islands, British</option><option>Virgin Islands, U.S.</option><option>Wallis and Futuna</option><option>Western Sahara</option><option>Yemen</option><option>Zambia</option><option>Zimbabwe</option></select></div></div>`;
        //return inpHTML;
        break;
      case "country":
        this.inpHTML = `<div>
            <div>
            <label for="Country*">Country*</label>
            <select label="Country*" name="Country*">
              <option></option><option>Afghanistan</option><option>Åland Islands</option><option>Albania</option><option>Algeria</option><option>American Samoa</option><option>Andorra</option><option>Angola</option><option>Anguilla</option><option>Antarctica</option><option>Antigua and Barbuda</option><option>Argentina</option><option>Armenia</option><option>Aruba</option><option>Australia</option><option>Austria</option><option>Azerbaijan</option><option>Bahamas</option><option>Bahrain</option><option>Bangladesh</option><option>Barbados</option><option>Belarus</option><option>Belgium</option><option>Belize</option><option>Benin</option><option>Bermuda</option><option>Bhutan</option><option>Bolivia</option><option>Bosnia and Herzegovina</option><option>Botswana</option><option>Bouvet Island</option><option>Brazil</option><option>British Indian Ocean Territory</option><option>Brunei Darussalam</option><option>Bulgaria</option><option>Burkina Faso</option><option>Burundi</option><option>Cambodia</option><option>Cameroon</option><option>Canada</option><option>Cape Verde</option><option>Cayman Islands</option><option>Central African Republic</option><option>Chad</option><option>Chile</option><option>China</option><option>Christmas Island</option><option>Cocos (Keeling) Islands</option><option>Colombia</option><option>Comoros</option><option>Congo</option><option>Congo, The Democratic Republic of the</option><option>Cook Islands</option><option>Costa Rica</option><option>Cote D'Ivoire</option><option>Croatia</option><option>Cuba</option><option>Cyprus</option><option>Czech Republic</option><option>Denmark</option><option>Djibouti</option><option>Dominica</option><option>Dominican Republic</option><option>Ecuador</option><option>Egypt</option><option>El Salvador</option><option>Equatorial Guinea</option><option>Eritrea</option><option>Estonia</option><option>Ethiopia</option><option>Falkland Islands (Malvinas)</option><option>Faroe Islands</option><option>Fiji</option><option>Finland</option><option>France</option><option>French Guiana</option><option>French Polynesia</option><option>French Southern Territories</option><option>Gabon</option><option>Gambia</option><option>Georgia</option><option>Germany</option><option>Ghana</option><option>Gibraltar</option><option>Greece</option><option>Greenland</option><option>Grenada</option><option>Guadeloupe</option><option>Guam</option><option>Guatemala</option><option>Guernsey</option><option>Guinea</option><option>Guinea-Bissau</option><option>Guyana</option><option>Haiti</option><option>Heard Island and Mcdonald Islands</option><option>Holy See (Vatican City State)</option><option>Honduras</option><option>Hong Kong</option><option>Hungary</option><option>Iceland</option><option>India</option><option>Indonesia</option><option>Iran, Islamic Republic Of</option><option>Iraq</option><option>Ireland</option><option>Isle of Man</option><option>Israel</option><option>Italy</option><option>Jamaica</option><option>Japan</option><option>Jersey</option><option>Jordan</option><option>Kazakhstan</option><option>Kenya</option><option>Kiribati</option><option>Korea, Democratic People'S Republic of</option><option>Korea, Republic of</option><option>Kuwait</option><option>Kyrgyzstan</option><option>Lao People'S Democratic Republic</option><option>Latvia</option><option>Lebanon</option><option>Lesotho</option><option>Liberia</option><option>Libyan Arab Jamahiriya</option><option>Liechtenstein</option><option>Lithuania</option><option>Luxembourg</option><option>Macao</option><option>Macedonia, The Former Yugoslav Republic of</option><option>Madagascar</option><option>Malawi</option><option>Malaysia</option><option>Maldives</option><option>Mali</option><option>Malta</option><option>Marshall Islands</option><option>Martinique</option><option>Mauritania</option><option>Mauritius</option><option>Mayotte</option><option>Mexico</option><option>Micronesia, Federated States of</option><option>Moldova, Republic of</option><option>Monaco</option><option>Mongolia</option><option>Montserrat</option><option>Morocco</option><option>Mozambique</option><option>Myanmar</option><option>Namibia</option><option>Nauru</option><option>Nepal</option><option>Netherlands</option><option>Netherlands Antilles</option><option>New Caledonia</option><option>New Zealand</option><option>Nicaragua</option><option>Niger</option><option>Nigeria</option><option>Niue</option><option>Norfolk Island</option><option>Northern Mariana Islands</option><option>Norway</option><option>Oman</option><option>Pakistan</option><option>Palau</option><option>Palestinian Territory, Occupied</option><option>Panama</option><option>Papua New Guinea</option><option>Paraguay</option><option>Peru</option><option>Philippines</option><option>Pitcairn</option><option>Poland</option><option>Portugal</option><option>Puerto Rico</option><option>Qatar</option><option>Reunion</option><option>Romania</option><option>Russian Federation</option><option>RWANDA</option><option>Saint Helena</option><option>Saint Kitts and Nevis</option><option>Saint Lucia</option><option>Saint Pierre and Miquelon</option><option>Saint Vincent and the Grenadines</option><option>Samoa</option><option>San Marino</option><option>Sao Tome and Principe</option><option>Saudi Arabia</option><option>Senegal</option><option>Serbia and Montenegro</option><option>Seychelles</option><option>Sierra Leone</option><option>Singapore</option><option>Slovakia</option><option>Slovenia</option><option>Solomon Islands</option><option>Somalia</option><option>South Africa</option><option>South Georgia and the South Sandwich Islands</option><option>South Sudan</option><option>Spain</option><option>Sri Lanka</option><option>Sudan</option><option>Suriname</option><option>Svalbard and Jan Mayen</option><option>Swaziland</option><option>Sweden</option><option>Switzerland</option><option>Syrian Arab Republic</option><option>Taiwan</option><option>Tajikistan</option><option>Tanzania, United Republic of</option><option>Thailand</option><option>Timor-Leste</option><option>Togo</option><option>Tokelau</option><option>Tonga</option><option>Trinidad and Tobago</option><option>Tunisia</option><option>Turkey</option><option>Turkmenistan</option><option>Turks and Caicos Islands</option><option>Tuvalu</option><option>Uganda</option><option>Ukraine</option><option>United Arab Emirates</option><option>United Kingdom</option><option>United States</option><option>United States Minor Outlying Islands</option><option>Uruguay</option><option>Uzbekistan</option><option>Vanuatu</option><option>Venezuela</option><option>Viet Nam</option><option>Virgin Islands, British</option><option>Virgin Islands, U.S.</option><option>Wallis and Futuna</option><option>Western Sahara</option><option>Yemen</option><option>Zambia</option><option>Zimbabwe</option></select></div></div>`;
        return this.inpHTML;
      default:
        return (this.inpHTML = <InputControlField type="text" />);
    }
  }
  render() {
    let controlsData = this.getControls;
    console.log("controlsData: ");
    console.log(controlsData);
    return <div>{controlsData}</div>;
  }
}
export default GetFormFields;
