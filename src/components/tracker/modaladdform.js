import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Modal, Button, Schema, Alert, RadioGroup, Radio } from 'rsuite';
 
const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('Please input a description for your ticket')
});

class CustomField extends React.PureComponent {
  render() {
    const { name, message, label, accepter, error, ...props } = this.props;
    return (
      <FormGroup className={error ? 'has-error' : ''}>
        <ControlLabel>{label} </ControlLabel>
        <FormControl
          name={name}
          accepter={accepter}
          errorMessage={error}
          {...props}
        />
        <HelpBlock>{message}</HelpBlock>
      </FormGroup>
    );
  }
}

/**** This is a Modal Form Component used within tracker component when user clicks Add Ticket button *****/

class ModalAddForm extends React.Component {

    constructor(props) {
        super(props);
        const formValue = {
          name: '',
          priority: 'Low',
          description: ''
        };
        this.state = {
            formValue: formValue,
            formError: {},
            show: false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleSubmit() {
        const { formValue } = this.state;
        if (!this.form.check()) {
          Alert.error('Please Input all Values!');
          return;
        }
        Alert.success('Success');
        this.props.formSubmitted(formValue);
        this.props.close();
      }

      close() {
        this.setState({ show: false });
      }

      open() {
        this.setState({ show: true });
      }

      handleChange(value) {
        this.setState({
          formValue: value
        });
      }


      render() {

        const { formError } = this.state;

        return (
          <div>
            <Modal show={this.props.show} onHide={this.close} size="xs">
              <Modal.Header>
                <Modal.Title>{this.props.edit ? 'Edit Ticket': 'New Ticket'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                ref={ref => (this.form = ref)}
                onChange={formValue => {
                    this.setState({ formValue });
                }}
                onCheck={formError => {
                    this.setState({ formError });
                }}
                formValue={this.props.formValue}
                model={model}
                >
                <CustomField
                    name="name"
                    label="Name"
                    error={formError.name}
                />

                <CustomField
                    name="priority"
                    label="Priority"
                    accepter={RadioGroup}
                    error={formError.priority}
                    inline
                >
                    <Radio value={'Low'}>Low</Radio>
                    <Radio value={'Medium'}>Medium</Radio>
                    <Radio value={'High'}>High</Radio>
                </CustomField>
                <CustomField
                    name="description"
                    label="Description"
                    componentClass="textarea"
                    rows={5}
                    error={formError.description}
                />
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button 
                  onClick={this.handleSubmit} 
                  appearance="primary" 
                  color="green">
                  Submit
                </Button>
                <Button 
                  onClick={this.props.close} 
                  appearance="primary" 
                  color="red">
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
}
 
export default ModalAddForm;