import React from "react";
export default class OutData extends React.Component {
    constructor(prop) {
        super();
    }
    render() {
        const { actionResponse } = this.props;
        return (
            <>
                {actionResponse && actionResponse.length > 0 && (
                    actionResponse.map((response) => (
                        response.responseInfo.body && (
                            <div>
                                {JSON.stringify(response.responseInfo.body)}
                            </div>
                        )
                    ))
                )}
            </>
        );
    }
}