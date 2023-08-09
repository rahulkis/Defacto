import React from "react";
import "../../../assets/custom/FormHelp.css";

class HowToUseWebHooks extends React.Component {
  render() {
    return (
      <div>
        <div className="breadcrumb" dir="ltr">
          <div class="link__arrow o__ltr">
            <a href="#pablo">All Collections</a>
          </div>

          <div className="link__arrow o__ltr">
            <a href="#pablo">After Submission and Integrations</a>
          </div>

          <div className="link__arrow o__ltr">How To Use Webhooks</div>
        </div>
        <div className="paper paper__large">
          <div className="content help-content content__narrow">
            <div className="article intercom-force-break">
              <div className="article__meta" dir="ltr">
                <h1 className="t__h1">How To Use Webhooks</h1>
                <div className="article__desc" />
                <div className="avatar">
                  <div className="avatar__photo o__ltr">
                    <img
                      alt=""
                      src="https://static.intercomassets.com/avatars/708006/square_128/profile-1487056720.jpg?1487056720"
                      className="avatar__image"
                    />
                  </div>

                  <div className="avatar__info">
                    <div>
                      Written by{" "}
                      <span className="c__darker"> Dean McPherson</span>
                      <br /> Updated over a week ago
                    </div>
                  </div>
                </div>
              </div>
              <div />
            </div>

            <p className="intercom-align-left">
              Webhooks are used by developers to integrate Defactoform form
              submissions into their own services. This is particularly useful
              if you would like to use forms within your own services or do
              something special or difficult with the submitted data. Note that
              webhooks are only available on Pro and Agency plans. For
              non-technical teams, Zapier is a more appropriate solution for
              most needs.
            </p>
            <h4 className="intercom-align-left" data-post-processed="true">
              Adding a webhook
            </h4>

            <p className="intercom-align-left">
              In the form editor, go to After Submissions &gt; Integrations.
              Under the “Add Webhook” section, add the URL of your endpoint and
              click the “Add Webhook” button to add the webhook. That’s all it
              takes.
            </p>

            <div className="intercom-container intercom-align-left">
              <img
                alt=""
                src="https://downloads.intercomcdn.com/i/o/65486389/68f843ef291a25ea81d564df/Screen%2520Shot%25202018-06-25%2520at%25204.48.43%2520pm.png"
              />
            </div>
            <h4 className="intercom-align-left" data-post-processed="true">
              Testing webhooks
            </h4>
            <p className="intercom-align-left">
              You can test a webhook at any time, by clicking the “TEST” button
              in the “Webhooks” section of After Submissions &gt; Integrations.
              This will trigger the webhook with the latest submission’s data.
              Of course, you can always submit the form to test it as well.
            </p>
            <p className="intercom-align-left">
              <b>
                <i>
                  Note that the form must have at least one submission to test
                  webhooks.
                </i>
              </b>
            </p>
            <h4 className="intercom-align-left" data-post-processed="true">
              Submission payload
            </h4>
            <p className="intercom-align-left">
              Webhooks POST a JSON payload on submission to the webhook URL. The
              JSON payload looks like the following;
            </p>
            <pre>
              <code>
                {"{"}
                <br />
                &nbsp; &nbsp; "data": [<br />
                &nbsp; &nbsp; &nbsp; &nbsp; {"{"} <br /> &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; "title": "question 1", //Title of question
                as defined
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "description": "This
                is the second question",
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "type": "address",
                "//Question type"
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "key": "ba7ri",
                "//Question pre-fill key (unique to form)."
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "value": "343 Tester
                Road, Snohomish, Washington, 98290, United States" //Submitted
                value for question
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "custom_key":
                "address_1" //Custom pre-fill key (if set).
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; {"},"} <br />
                &nbsp; &nbsp; &nbsp; &nbsp;{"{"}
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "title": "question 2",
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "description": "This
                is the second question",
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "type": "text",
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "key": "tgp8",
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "value": "Test 123",
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; "custom_key": ""
                <br />
                &nbsp; &nbsp; &nbsp; &nbsp;{"}"}
                <br /> "//... each question has its own object."
                <br />
                &nbsp; &nbsp; ],
                <br />
                &nbsp; &nbsp; "submission_id": "XXXXXXXXXXXXXXXXXXX", //Unique
                ID for submission.
                <br />
                &nbsp; &nbsp; "created_at": "2017-06-09 09:51:23", //Submission
                date
                <br />
                &nbsp; &nbsp; "ip_address": "192.168.10.1", //IP Address of
                submission
                <br />
                &nbsp; &nbsp; "charge": null //if a payment is made, payment
                information is given here.
                <br />
                {"}"}
                <br />
              </code>
            </pre>
            <p className="intercom-align-left">
              The easiest way to see what your submission structure looks like
              is to use a service like{" "}
              <a
                href="https://requestinspector.com/"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                https://requestinspector.com
              </a>{" "}
              to create a webhook URL and send test data there.
            </p>
            <h4 className="intercom-align-left" data-post-processed="true">
              Answer Piping in URL
            </h4>
            <p className="intercom-align-left">
              The webhook URL also supports answer piping, which means that if
              you need to pass answers through as query string parameters, you
              can!
            </p>
            <p className="intercom-align-left">
              You can add answer piped values by either writing {"{{ key }}"}{" "}
              where "key" is the relevant question's pre-fill key, or by using
              the + menu to the right of the input.
            </p>
            <div className="intercom-container intercom-align-left">
              <img
                alt=""
                src="https://downloads.intercomcdn.com/i/o/88318652/39ec3b9948c58e18bd031b1a/Screen+Shot+2018-11-30+at+9.45.39+am.png"
              />
            </div>
            <p className="intercom-align-left" />
          </div>
        </div>
      </div>
    );
  }
}

export default HowToUseWebHooks;
