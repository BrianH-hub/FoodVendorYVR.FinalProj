import React, { Component } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from "react-google-maps";
import Pagination from './Pagination';

function Map(props) {
    return (
        <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: 49.2820, lng: -123.1171 }} >
            {props.foodVendors.map(
                vendor => (
                    <Marker
                        key={vendor.key}
                        title={vendor.business_name}
                        position={{ lat: vendor.latitude, lng: vendor.longitude }}
                        onClick={() => props.markerClickHandler(vendor)} />

                )
            )}
        </GoogleMap>
    );
}

// withScript basically adds the required js to embed map in page

// withGoogleMap(Map) pushes the result of the Map function above
// into the embedded google map js container 
const WrappedMap = withScriptjs(withGoogleMap(props => (Map(props))));


const API = 'api/FoodVendor/FoodVendors';

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
                this.setState({ foodVendors: data, loading: false, nameSort: 'asc', descriptionSort: 'asc' });
            });
        this.onChangePage = this.onChangePage.bind(this);
    }

    markerClickHandler(foodVendor) {
        fetch('api/FoodVendor/FoodVendor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(foodVendor)
        })
            .then(response => { console.log(response); })
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    onSortChange(sortParam) {
        let sortedVendors;
        if (sortParam === 'name') {
            if (this.state.nameSort === 'asc') {
                this.setState({ nameSort: 'desc', description: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.business_name === null) - (b.business_name === null) || +(a.business_name > b.business_name) || -(a.business_name < b.business_name)
                });
            } else {
                this.setState({ nameSort: 'asc', description: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.business_name === null) - (b.business_name === null) || -(a.business_name > b.business_name) || +(a.business_name < b.business_name)
                });
            }
        } else {
            if (this.state.description === 'asc') {
                this.setState({ nameSort: 'asc', description: 'desc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.description === null) - (b.description === null) || +(a.description > b.description) || -(a.description < b.description)
                });
            } else {
                this.setState({ nameSort: 'asc', description: 'asc' });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (a.description === null) - (b.description === null) || -(a.description > b.description) || +(a.description < b.description)
                });
            }
        }

        this.setState({ foodVendors: sortedVendors });
    }

    renderFoodVendorsTable(foodVendors) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th onClick={() => this.onSortChange('name')}>Name</th>
                        <th onClick={() => this.onSortChange('description')}>Description</th>
                        <th>Longitude</th>
                        <th>Latitude</th>
                    </tr>
                </thead>
                {this.state.pageOfItems.map(vendor =>
                    <tbody>
                        <tr key={vendor.key}>
                            <td>{vendor.business_name}</td>
                            <td>{vendor.description}</td>
                            <td>{vendor.longitude}</td>
                            <td>{vendor.latitude}</td>
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
                <WrappedMap
                    foodVendors={this.state.foodVendors}
                    markerClickHandler={this.markerClickHandler}


                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}`}
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '400px' }} />}
                    mapElement={<div style={{ height: '100%' }} />}
                />
                {contents}
            </div>
        );

    }
}
