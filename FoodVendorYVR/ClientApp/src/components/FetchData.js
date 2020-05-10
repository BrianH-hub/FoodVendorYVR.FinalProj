import React, { Component } from 'react';

import Pagination from './Pagination';


const API = 'https://opendata.vancouver.ca/api/records/1.0/search/?dataset=food-vendors&rows=40';

export class FetchData extends Component {
    static displayName = FetchData.name;

    constructor(props) {
        super(props);
        this.state = {
            foodVendors: [],
            loading: true,
            pageOfItems: []
        };
        this.onSortChange = this.onSortChange.bind(this);
        fetch(API)
            .then(response => response.json())
            .then(data => {
                this.setState({ foodVendors: data.records, loading: false, nameSort: 'asc', descriptionSort: 'desc' });
            });
        
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    onSortChange(sortParam) {
        let sortedVendors;
        if (sortParam === 'name') {
            console.log("name")
            if (this.state.nameSort === 'asc') {
                this.setState({ nameSort: 'desc', description: 'asc' });
                console.log(this.state.foodVendors)
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.fields.business_name === null)
                        - (b.fields.business_name === null) ||
                        +(a.fields.business_name > b.fields.business_name) ||
                        -(a.fields.business_name < b.fields.business_name)
                });
            } else {
                this.setState({ nameSort: 'asc', description: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.fields.business_name === null) - (b.fields.business_name === null) ||
                        -(a.fields.business_name > b.fields.business_name) ||
                        +(a.fields.business_name < b.fields.business_name)
                });
            }
        } else {
            console.log("description")
            if (this.state.description === 'asc') {
                this.setState({ nameSort: 'asc', description: 'desc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.fields.description === null) - (b.fields.description === null) ||
                        +(a.fields.description > b.fields.description) ||
                        -(a.fields.description < b.fields.description)
                });
            } else {
                this.setState({ nameSort: 'asc', description: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.fields.description === null) - (b.fields.description === null) ||
                        -(a.fields.description > b.fields.description) || +(a.fields.description < b.fields.description)
                });
            }
        }

        this.setState({ foodVendors: sortedVendors });
        console.log(sortedVendors)
    }

    renderFoodVendorsTable(foodVendors) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th onClick={() => this.onSortChange('name')}>Name</th>
                        <th onClick={() =>
                            this.onSortChange('description')}>Description</th>
                        <th>Local Area</th>
                        <th>Location</th>
                    </tr>
                </thead>
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

            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderFoodVendorsTable(this.state.foodVendors);

        return (
            <div>
                <h1>Food Vendors</h1>
                
                {contents}
            </div>
        );

    }
}
