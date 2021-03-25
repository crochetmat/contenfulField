import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { SelectField, Spinner, Option } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  detachExternalChangeHandler = null;

  constructor(props) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue(),
      error: false,
      hasLoaded: false,
      items: [],
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    console.log(this.props.sdk);

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);

    fetch('https://api-staging.mos.com/scholarship-1/ref/virtualform/properties')
      .then((res) => res.json())
      .then(
        (items) => {
          this.setState({
            hasLoaded: true,
            items,
          });
        },
        (error) => {
          this.setState({
            hasLoaded: true,
            error: error,
          });
        }
      );
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = (value) => {
    this.setState({ value });
  };

  onChange = (e) => {
    const value = e.currentTarget.value;
    this.setState({ value });
    if (value) {
      this.props.sdk.field.setValue(value);
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  render() {
    if (!this.state.hasLoaded) {
      return <Spinner />;
    }

    return (
      <SelectField
        id='mos-user-info-input'
        name='mos-user-info-input'
        labelText='Select a property'
        helpText='Link the input to mos-user-info property'
        value={this.state.value}
        onChange={this.onChange}
      >
        <Option value=''></Option>
        {this.state.items.map((item) => {
          return (
            <Option key={item.name} value={item.name}>
              {item.name}
            </Option>
          );
        })}
      </SelectField>
    );
  }
}

init((sdk) => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}
