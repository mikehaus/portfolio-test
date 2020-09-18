import React from 'react';
import { Form, FormGroup, FormControl, ControlLabel, HelpBlock, Modal, Button, Schema, Alert, RadioGroup, Radio, SelectPicker } from 'rsuite';

const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  description: StringType().isRequired('Please input a description for your ticket')
});

const FORM_STYLES = {

}

class CustomField extends React.PureComponent {
  render() {
    const { name, message, label, accepter, error, ...props } = this.props;
    return (
      <FormGroup className={error ? 'has-error' : ''}>
        <ControlLabel>{label}</ControlLabel>
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

class ModalAddEditForm extends React.Component {

    constructor(props) {
        super(props);
        const formValue = {
          name: '',
          priority: 'Low',
          description: '',
          category: ''
        };
        this.state = {
            formValue: formValue,
            formError: {},
            show: false,
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
      }

      handleSubmit() {
        const { formValue } = this.state;
        if (!this.form.check()) {
          Alert.error('Please Input all Values!');
          return;
        }
        Alert.success('Success');
        {!this.props.edit ? 
          this.props.formSubmitted(formValue) :
          this.handleEdit();
        }
        this.props.close();
      }

      handleEdit() {
        console.log('got to handleEdit()')
        const { formValue } = this.state;
        if (!this.form.check()) {
          Alert.error('Please Input all Values!');
          return;
        }
        Alert.success('Success');
        this.props.formSubmitEdit(formValue, this.props.formID);
        this.props.close();
      }

      close() {
        this.setState({ show: false });
      }

      open() {
        this.setState({ 
          show: true,
        });
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
            <Modal 
              show={this.props.show} 
              onHide={this.close}
              onExited={this.close}
              size='xs'>
              <Modal.Header
                closeButton={false}>
                <Modal.Title>
                  {this.props.edit ? 
                  'Edit Ticket' : 
                  'New Ticket' }
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                ref={ref => (this.form = ref)}
                onChange={formValue => {
                    this.setState({ formValue });
                    console.log(formValue);
                }}
                onCheck={formError => {
                    this.setState({ formError });
                }}
                formValue={!this.props.edit ?
                  this.state.formValue :
                  this.props.editData}
                model={model}>
                
                <CustomField
                    name='name'
                    label='Name'
                    error={formError.name}
                    value={!this.props.edit ?
                      this.state.formValue.name :
                      this.props.editData.name }
                />
                <CustomField
                    name='priority'
                    label='Priority'
                    accepter={RadioGroup}
                    error={formError.priority}
                    value={!this.props.edit ?
                      this.state.formValue.priority :
                      this.props.editData.priority }
                    inline
                >
                    <Radio value={'Low'}>Low</Radio>
                    <Radio value={'Medium'}>Medium</Radio>
                    <Radio value={'High'}>High</Radio>
                </CustomField>
                <CustomField
                    name='description'
                    label='Description'
                    componentClass='textarea'
                    rows={5}
                    error={formError.description}
                    value={!this.props.edit ?
                      this.state.formValue.description :
                      this.props.editData.description}
                />
                <CustomField
                name='category'
                label='Category'
                accepter={SelectPicker}
                style={{ display: 'inline-block', width: 300 }}
                value={!this.props.edit ? 
                  this.state.formValue.category :
                  this.props.category}
                data={[
                  { label: 'Frontend', value: 'frontend' },
                  { label: 'Backend', value: 'backend' },
                  { label: 'API', value: 'api' },
                  { label: 'Testing', value: 'testing' },
                ]}/>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button 
                  onClick={this.props.close} 
                  appearance='ghost' 
                  color='red'>
                  Cancel
                </Button>
                <Button 
                  onClick={this.handleSubmit} 
                  appearance='primary' 
                  color='green'>
                  Submit
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
}
 
export default ModalAddEditForm;