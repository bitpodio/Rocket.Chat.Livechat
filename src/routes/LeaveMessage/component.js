import { h, Component } from 'preact';

import { Button } from '../../components/Button';
import { ButtonGroup } from '../../components/ButtonGroup';
import { Form, FormField, SelectInput, TextInput, Validations } from '../../components/Form';
import Screen from '../../components/Screen';
import { createClassName, sortArrayByColumn } from '../../components/helpers';
import I18n from '../../i18n';
import styles from './styles.scss';


const defaultTitle = I18n.t('Leave a message');
const defaultMessage = I18n.t('Our agents are not available right now. please leave a message and we will get back to you.');
const defaultUnavailableMessage = ''; // TODO

export default class LeaveMessage extends Component {
	validations = {
		name: [Validations.nonEmpty],
		email: [Validations.nonEmpty, Validations.email],
		department: [],
		message: [Validations.nonEmpty],
	}

	getDefaultState = () => {
		const { hasDepartmentField, departments } = this.props;

		let department = null;
		if (hasDepartmentField && departments && departments.length > 0) {
			department = { value: '' };
		}

		return {
			name: { value: '' },
			email: { value: '' },
			department,
			message: { value: '' },
		};
	};

	getValidableFields = () => Object.keys(this.validations)
		.map((fieldName) => (this.state[fieldName] ? { fieldName, ...this.state[fieldName] } : null))
		.filter(Boolean)

	validate = ({ name, value }) => this.validations[name].reduce((error, validation) => error || validation({ value }), undefined)

	validateAll = () => {
		for (const { fieldName: name, value } of this.getValidableFields()) {
			const error = this.validate({ name, value });
			this.setState({ [name]: { ...this.state[name], value, error, showError: false } });
		}
	}

	reset = () => this.setState(this.getDefaultState());

	isValid = () => this.getValidableFields().every(({ error } = {}) => !error)

	handleFieldChange = (name) => ({ target: { value } }) => {
		const error = this.validate({ name, value });
		this.setState({ [name]: { ...this.state[name], value, error, showError: false } }, () => { this.validateAll(); });
	}

	handleNameChange = this.handleFieldChange('name')

	handleEmailChange = this.handleFieldChange('email')

	handleDepartmentChange = this.handleFieldChange('department')

	handleMessageChange = this.handleFieldChange('message')

	handleSubmit = async (event) => {
		event.preventDefault();

		if (this.props.onSubmit) {
			const values = Object.entries(this.state)
				.filter(([, state]) => state !== null)
				.map(([name, { value }]) => ({ [name]: value }))
				.reduce((values, entry) => ({ ...values, ...entry }), {});

			if (await this.props.onSubmit(values)) {
				this.reset();
			}
		}
	}

	constructor(props) {
		super(props);
		this.state = this.getDefaultState();
	}

	componentDidMount() {
		this.validateAll();
	}

	renderForm = ({ loading, departments, valid = this.isValid() }, { name, email, department, message }) => (
		<Form onSubmit={this.handleSubmit}>
			{name
				? (
					<FormField
						required
						label={I18n.t('Name')}
						error={name.showError && name.error}
					>
						<TextInput
							name='name'
							value={name.value}
							placeholder={I18n.t('%{field}*', { field: I18n.t('Name') })}
							disabled={loading}
							onInput={this.handleNameChange}
						/>
					</FormField>
				)
				: null}

			{email
				? (
					<FormField
						required
						label={I18n.t('Email')}
						error={email.showError && email.error}
					>
						<TextInput
							name='email'
							value={email.value}
							placeholder={I18n.t('%{field}*', { field: I18n.t('Email') })}
							disabled={loading}
							onInput={this.handleEmailChange}
						/>
					</FormField>
				)
				: null}

			{department
				? (
					<FormField
						label={I18n.t('I need help with...')}
						error={department.showError && department.error}
					>
						<SelectInput
							name='department'
							value={department.value}
							options={sortArrayByColumn(departments, 'name').map(({ _id, name }) => ({ value: _id, label: name }))}
							placeholder={I18n.t('Choose an option...')}
							disabled={loading}
							error={department.showError}
							onInput={this.handleDepartmentChange}
						/>
					</FormField>
				)
				: null}

			{message
				? (
					<FormField
						required
						label={I18n.t('Message')}
						error={message.showError && message.error}
					>
						<TextInput
							name='message'
							value={message.value}
							multiline
							rows={4}
							placeholder={I18n.t('Message*')}
							disabled={loading}
							error={message.showError}
							onInput={this.handleMessageChange}
						/>
					</FormField>
				)
				: null}

			<ButtonGroup>
				<Button submit loading={loading} disabled={!valid || loading} stack>{I18n.t('Leave a message')}</Button>
			</ButtonGroup>
		</Form>
	)

	render = ({ color, title, message, unavailableMessage, hasForm, ...props }) => (
		<Screen
			color={color}
			title={title || defaultTitle}
			className={createClassName(styles, 'leave-message')}
			{...props}
		>
			<Screen.Content>
				<p className={createClassName(styles, 'leave-message__main-message')}>
					{hasForm ? message || defaultMessage : unavailableMessage || defaultUnavailableMessage}
				</p>

				{hasForm && this.renderForm(this.props, this.state)}
			</Screen.Content>
			<Screen.Footer />
		</Screen>
	)
}
