<?php
/**
 * Class Newsletters Test usage reports.
 *
 * @package Newspack_Newsletters
 */

/**
 * Newsletters Usage Reports Test.
 */
class Usage_Reports_Test extends WP_UnitTestCase {
	/**
	 * Test usage report.
	 */
	public function test_usage_report_basic() {
		// Ensure the API key is not set (might be set by a different test).
		delete_option( 'newspack_mailchimp_api_key' );

		self::assertEquals(
			Newspack_Newsletters_Mailchimp_Usage_Reports::get_usage_report()->to_array(),
			[
				'date'           => gmdate( 'Y-m-d', strtotime( '-1 day' ) ),
				'emails_sent'    => 0,
				'opens'          => 0,
				'clicks'         => 0,
				'unsubscribes'   => 0,
				'subscribes'     => 0,
				'total_contacts' => 0,
				'growth_rate'    => 0,
			]
		);
	}
}
