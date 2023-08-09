import React from "react";
export default class InData extends React.Component {
    constructor(prop) {
        super();
    }

    render() {
        const { data } = this.props;
        return (
            <div className="usage-status">
                {data && data.length > 0 ? (
                    data.map((item) => (
                        <div>
                            {item.key}<span>: {item.value}</span>
                        </div>
                    ))
                ) : (<div>
                    No Input Data
                </div>)}

            </div>
        );


    }
}