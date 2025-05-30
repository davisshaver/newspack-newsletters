/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect, Fragment } from '@wordpress/element';
import { SelectControl, PanelBody, Spinner, SVG } from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { NEWSLETTER_AD_CPT_SLUG } from '../../../utils/consts';

import './editor.scss';

export default function SubscribeEdit( { setAttributes, attributes: { adId } } ) {
	const { postId } = useSelect( select => {
		const { getCurrentPostId } = select( 'core/editor' );
		return { postId: getCurrentPostId() };
	} );
	const [ adsConfig, setAdsConfig ] = useState( {
		count: 0,
		label: __( 'ads', 'newspack-newsletters' ),
		ads: [],
	} );
	const [ isEmpty, setIsEmpty ] = useState( false );
	const [ inFlight, setInFlight ] = useState( false );
	useEffect( () => {
		setInFlight( true );
		apiFetch( {
			path: `/wp/v2/${ NEWSLETTER_AD_CPT_SLUG }/config/?postId=${ postId }`,
		} )
			.then( response => {
				setAdsConfig( response );
				if ( ! response.ads.length ) {
					setIsEmpty( true );
				} else {
					setIsEmpty( false );
				}
			} )
			.catch( e => {
				console.warn( e ); // eslint-disable-line no-console
			} )
			.finally( () => {
				setInFlight( false );
			} );
	}, [ postId ] );
	const containerHeight = 200;
	function getAdTitle() {
		if ( ! adId ) {
			return __( 'Automatic selection', 'newspack-newsletters' );
		}
		const ad = adsConfig.ads.find( _ad => _ad.id.toString() === adId );
		return ad ? ad.title : '';
	}
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Ad Settings' ) }>
					<SelectControl
						label={ __( 'Ad' ) }
						value={ adId }
						disabled={ inFlight || isEmpty }
						options={ [
							{
								label: __( 'Automatic selection', 'newspack-newsletters' ),
								value: '',
							},
						].concat(
							adsConfig.ads.map( ad => ( {
								label: ad.title,
								value: ad.id,
							} ) )
						) }
						onChange={ val => setAttributes( { adId: val } ) }
					/>
					{ ! adId && ! isEmpty && (
						<p>
							{ __(
								'By not selecting an ad, the system automatically chooses which ad should be rendered in this position.',
								'newspack-newsletters'
							) }
						</p>
					) }
					{ isEmpty ? (
						<p>
							{ __(
								"No ads are available. Make sure you have created ads and that they are scheduled to run on the newsletter's publish date.",
								'newspack-newsletters'
							) }
						</p>
					) : null }
				</PanelBody>
			</InspectorControls>
			<div
				className="newspack-newsletters-ad-block-placeholder"
				style={ { width: 600, height: containerHeight } }
			>
				<Fragment>
					<SVG
						className="newspack-newsletters-ad-block-mock"
						viewBox={ '0 0 600 ' + containerHeight }
					>
						<rect width="600" height={ containerHeight } strokeDasharray="2" />
						<line x1="0" y1="0" x2="100%" y2="100%" strokeDasharray="2" />
					</SVG>
					{ ! inFlight && (
						<span className="newspack-newsletters-ad-block-ad-label">{ getAdTitle() }</span>
					) }
				</Fragment>
				{ inFlight && <Spinner /> }
			</div>
		</div>
	);
}
