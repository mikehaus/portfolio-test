import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Modal, Button, Schema, Alert, RadioGroup, Radio } from 'rsuite';
 
const { ArrayType, StringType, NumberType } = Schema.Types;
const model = Schema.Model({
  skills: ArrayType()
    .minLength(2, 'Please select at least 2 types of Skills.')
    .isRequired('This field is required.'),
  status: ArrayType()
    .minLength(2, 'Please select at least 2 types of Status.')
    .isRequired('This field is required.'),
  level: NumberType().min(5, 'This field must be greater than 5')
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



class ModalAddForm extends React.Component {

    constructor(props) {
        super(props);
        const formValue = {
            name: '',
            priority: 'Low',
            description: '',
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

        const { formError, formValue } = this.state;
        return (
          <div>
            <Modal show={this.props.show} onHide={this.close} size="xs">
              <Modal.Header>
                <Modal.Title>New Ticket</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                ref={ref => (this.form = ref)}
                onChange={formValue => {
                    console.log(formValue);
                    this.setState({ formValue });
                }}
                onCheck={formError => {
                    console.log(formError, 'formError');
                    this.setState({ formError });
                }}
                formValue={formValue}
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


                <FormGroup>
                    <Button appearance="primary" onClick={this.handleSubmit}>
                    Submit
                    </Button>
                </FormGroup>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close} appearance="primary">
                  Confirm
                </Button>
                <Button onClick={this.props.close} appearance="subtle">
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
}
 
export default ModalAddForm;