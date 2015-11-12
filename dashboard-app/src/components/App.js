/** @jsx React.DOM */

var React = require('react');

var DashboardApp = require('DashboardApp');

// Production API URL
// TODO(jchan): Add conditional logic when we have SkyMath production environment
if (window.location.hostname === '104.131.82.183') {
    API_URL = 'http://api.skymath.com/api';
} else {
    API_URL = 'http://104.131.82.183/api'
}

var adminAppInstance = React.render(
    <DashboardApp />,
    document.getElementById('app')
);
