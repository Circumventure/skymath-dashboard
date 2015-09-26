/** @jsx React.DOM */

var React = require('react');

var DashboardApp = require('DashboardApp');

API_URL = 'https://api.skymath.com/api';

var adminAppInstance = React.render(
    <DashboardApp />,
    document.getElementById('app')
);
