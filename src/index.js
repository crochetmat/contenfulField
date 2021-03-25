import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { SelectField, Spinner, Option } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

function App(props) {
  detachExternalChangeHandler = null;

  const [items, setItems] = useState([]);
  const [value, setValue] = useState(props.sdk.field.getValue());
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    props.sdk.window.startAutoResizer();
    console.log(props.sdk);

    detachExternalChangeHandler = props.sdk.field.onValueChanged(onExternalChange());

    fetch('https://api-staging.mos.com/scholarship-1/ref/virtualform/properties')
      .then((res) => res.json())
      .then(
        (items) => {
          setHasLoaded(true);
          setItems(items);
        },
        (error) => {
          setHasLoaded(true);
        }
      );

    return () => {
      if (detachExternalChangeHandler) {
        detachExternalChangeHandler();
      }
    };
  }, [props]);

  onExternalChange = (value) => {
    setValue(value);
  };

  onChange = (e) => {
    const value = e.currentTarget.value;
    setValue(value);
    if (value) {
      props.sdk.field.setValue(value);
    } else {
      props.sdk.field.removeValue();
    }
  };

  if (!hasLoaded) {
    return <Spinner />;
  }

  return (
    <SelectField id='mos-user-info-input' name='mos-user-info-input' labelText='Select a property' helpText='Link the input to mos-user-info property' value={value} onChange={onChange}>
      <Option value=''></Option>
      {items.map((item) => {
        return (
          <Option key={item.name} value={item.name}>
            {item.name}
          </Option>
        );
      })}
    </SelectField>
  );
}

init((sdk) => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

// Enabling hot reload
if (module.hot) {
  module.hot.accept();
}
