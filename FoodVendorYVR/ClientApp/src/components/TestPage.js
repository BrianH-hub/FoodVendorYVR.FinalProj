import React, { Component } from 'react';
import Pagination from './Pagination';
const API = 'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=food-vendors';


export class TestPage extends Component {
    constructor() {
        super()
        this.state = {
            foodVendors: [],
            pageOfItems: []
        }
        fetch(API)
            .then(data => data.json())
            .then(data => {
                console.log(data);
                this.setState({ foodVendors: data.records, loading: false});
            });
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }


    render() {

        return (    
            <div>
                {this.state.pageOfItems.map(vendor =>
                    <tbody>
                            <tr key={vendor.fields.key}>
                                <td>{vendor.fields.business_name}</td>
                                <td>{vendor.fields.description}</td>
                            <td>{vendor.fields.geo_localarea}</td>
                            <td>{vendor.fields.location}</td>
                            </tr>
                    </tbody>
                )}
                <Pagination items={this.state.foodVendors} onChangePage={this.onChangePage} />

            </div >
                )
    }
}