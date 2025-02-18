/**
 * WordPress dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import { BaseControl, FormTokenField, Button, ButtonGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { Icon, external } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { useIsRetrieving, useNewsletterDataError } from '../store';

// The autocomplete field for send lists and sublists.
const Autocomplete = ( {
	availableItems,
	label = '',
	onChange,
	onFocus,
	onInputChange,
	reset,
	selectedInfo,
} ) => {
	const [ isEditing, setIsEditing ] = useState( false );
	const isRetrieving = useIsRetrieving();
	const error = useNewsletterDataError();

	if ( selectedInfo && ! isEditing ) {
		return (
			<div className="newspack-newsletters__send-to">
				<p className="newspack-newsletters__send-to-details">
					{ selectedInfo.name }
					<span>
						{ selectedInfo.entity_type.charAt(0).toUpperCase() + selectedInfo.entity_type.slice(1) }
						{ selectedInfo?.hasOwnProperty( 'count' )
							? ' • ' +
							sprintf(
									// Translators: If available, show a contact count alongside the selected item's type. %s is the number of contacts in the item.
									_n( '%s contact', '%s contacts', selectedInfo.count, 'newspack-newsletters' ),
									selectedInfo.count.toLocaleString()
							)
							: '' }
					</span>
				</p>
				<ButtonGroup>
					<Button
						disabled={ isRetrieving }
						onClick={ () => setIsEditing( true ) }
						size="small"
						variant="secondary"
					>
						{ __( 'Edit', 'newspack-newsletters' ) }
					</Button>
					<Button
						disabled={ isRetrieving }
						onClick={ reset }
						size="small"
						variant="secondary"
					>
						{ __( 'Clear', 'newspack-newsletters' ) }
					</Button>
					{ selectedInfo?.edit_link && (
						<Button
							disabled={ isRetrieving }
							href={ selectedInfo.edit_link }
							size="small"
							target="_blank"
							variant="secondary"
							rel="noopener noreferrer"
						>
							{ __( 'Manage', 'newspack-newsletters' ) }
							<Icon icon={ external } size={ 14 } />
						</Button>
					) }
				</ButtonGroup>
			</div>
		);
	}

	return (
		<div className="newspack-newsletters__send-to">
			<BaseControl
				id="newspack-newsletters__send-to-autocomplete-input"
				help={ isRetrieving && sprintf(
					// Translators: Message shown while fetching list or sublist info. %s is the provider's label for the given entity type (list or sublist).
					__( 'Fetching %s info…', 'newspack-newsletters' ),
					label.toLowerCase()
				) }
			>
				<FormTokenField
					label={ sprintf(
						// Translators: SendTo autocomplete field label. %s is the provider's label for the given entity type (list or sublist).
						__( 'Select %s', 'newspack-newsletters' ),
						label.toLowerCase()
					) }
					maxSuggestions={ 10 }
					onChange={ selectedLabels => {
						onChange( selectedLabels );
						setIsEditing( false );
					} }
					onFocus={ onFocus }
					onInputChange={ onInputChange }
					suggestions={ availableItems.map( item => item.label ) }
					placeholder={ __( 'Start typing to search by name or type', 'newspack-newsletters' ) }
					value={ [] }
					__experimentalExpandOnFocus={ true }
					__experimentalShowHowTo={ false }
				/>
				{ error && (
					<p className="newspack-newsletters__error">
						{ error?.message || __( 'Error fetching send lists.', 'newspack-newsletters' ) }
					</p>
				) }
			</BaseControl>
			{ selectedInfo && (
				<ButtonGroup>
					<Button
						disabled={ isRetrieving }
						onClick={ () => setIsEditing( false ) }
						variant="secondary"
						size="small"
					>
						{ __( 'Cancel', 'newspack-newsletters' ) }
					</Button>
				</ButtonGroup>
			) }
		</div>
	);
};

export default Autocomplete;
