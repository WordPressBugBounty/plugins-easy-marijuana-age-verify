<?php

/**
 * Plugin Name: Marijuana Age Verify
 *
 * Description: Age verification for marijuana websites.
 * Author:      5 Star Plugins
 * Author URI:  https://5starplugins.com/
 * Version:     2.0.3
 *
 * Requires at least: 4.6
 * Requires PHP: 5.6
 *
 * Text Domain: easy-marijuana-age-verify
 * Domain Path: /languages
 * License: GPLv2 or later
 *
 *
 * Copyright 2021 5 Star Plugins
 *
 * The following code is a derivative work of the code from Chase Wiseman, which is licensed GPLv2.
 * This code is then also licensed under the terms of the GPLv2.
 */
/**
 * The main plugin file.
 *
 * This file loads the main plugin class and gets things running.
 *
 * @since   1.0.8
 *
 * @package Easy_Marijuana_Age_Verify
 *
 */
if ( !defined( 'WPINC' ) ) {
    die;
}
define( 'EMAV_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'EMAV_PLUGIN_FILE', plugin_basename( __FILE__ ) );
if ( function_exists( 'emav_fs' ) ) {
    emav_fs()->set_basename( false, __FILE__ );
    return;
}
// Don't allow this file to be accessed directly.
if ( !function_exists( 'emav_fs' ) ) {
    // Create a helper function for easy SDK access.
    /**
     * @return Freemius
     * @throws Freemius_Exception
     */
    function emav_fs() {
        global $emav_fs;
        if ( !isset( $emav_fs ) ) {
            // Include Freemius SDK.
            require_once EMAV_PLUGIN_DIR_PATH . 'includes/freemius/start.php';
            $emav_fs = fs_dynamic_init( array(
                'id'              => '2869',
                'slug'            => 'easy-marijuana-age-verify',
                'type'            => 'plugin',
                'public_key'      => 'pk_c9fa3bb959261e0be15a4019328bc',
                'is_premium'      => false,
                'premium_suffix'  => 'Premium',
                'has_addons'      => false,
                'has_paid_plans'  => true,
                'trial'           => array(
                    'days'               => 14,
                    'is_require_payment' => false,
                ),
                'has_affiliation' => 'all',
                'menu'            => array(
                    'slug' => 'easy-marijuana-age-verify',
                ),
                'is_live'         => true,
            ) );
        }
        return $emav_fs;
    }

}
global $emav_fs;
// Init Freemius.
$emav_fs = emav_fs();
$emav_fs->add_filter(
    'connect_message_on_update',
    'emav_fs_custom_connect_message_on_update',
    10,
    6
);
$emav_fs->add_filter(
    'connect_message',
    'emav_freemius_new_message',
    10,
    6
);
// Signal that SDK was initiated.
do_action( 'emav_fs_loaded' );
if ( !function_exists( 'emav_fs_settings_url' ) ) {
    function emav_fs_settings_url() {
        return admin_url( 'admin.php?page=easy-marijuana-age-verify' );
    }

}
$emav_fs->add_filter( 'after_skip_url', 'emav_fs_settings_url' );
$emav_fs->add_filter( 'after_connect_url', 'emav_fs_settings_url' );
$emav_fs->add_filter( 'after_pending_connect_url', 'emav_fs_settings_url' );
/**
 * The main class definition.
 */
require EMAV_PLUGIN_DIR_PATH . 'includes/class-easy-marijuana-age-verify.php';
// Set the plugin version dynamically
$emav_plugindata = get_file_data( __FILE__, array(
    'Version' => 'Version',
), false );
$emav_version = $emav_plugindata['Version'];
// Get the plugin running.
add_action( 'plugins_loaded', array('Easy_Marijuana_Age_Verify', 'get_instance') );
// Check that the admin is loaded.
if ( is_admin() ) {
    /**
     * The admin class definition.
     */
    require EMAV_PLUGIN_DIR_PATH . 'includes/admin/class-easy-marijuana-age-verify-admin.php';
    // Get the plugin's admin running.
    add_action( 'plugins_loaded', array('Easy_Marijuana_Age_Verify_Admin', 'get_instance') );
    add_action( 'admin_notices', function () {
        if ( !current_user_can( 'manage_options' ) ) {
            return;
        }
        $user_id = get_current_user_id();
        $meta_key_base = 'emav_review_notice';
        $first_seen = get_user_meta( $user_id, "{$meta_key_base}_first_seen", true );
        $dismissed = get_user_meta( $user_id, "{$meta_key_base}_dismissed", true );
        // Record first visit timestamp
        if ( !$first_seen ) {
            update_user_meta( $user_id, "{$meta_key_base}_first_seen", time() );
            return;
        }
        // Wait 30 days from first seen
        if ( time() - $first_seen < 30 * DAY_IN_SECONDS ) {
            return;
        }
        if ( $dismissed === 'dismissed' ) {
            return;
        }
        // Optional: only show on plugin settings page
        if ( !isset( $_GET['page'] ) || $_GET['page'] !== 'easy-marijuana-age-verify' ) {
            return;
        }
        // Handle dismiss/remind actions
        if ( isset( $_GET['emav_review_action'] ) ) {
            if ( $_GET['emav_review_action'] === 'dismiss' ) {
                update_user_meta( $user_id, "{$meta_key_base}_dismissed", 'dismissed' );
            } elseif ( $_GET['emav_review_action'] === 'remind' ) {
                update_user_meta( $user_id, "{$meta_key_base}_dismissed", time() );
            }
            wp_redirect( remove_query_arg( 'emav_review_action' ) );
            exit;
        }
        // Handle 7-day reminder delay
        if ( is_numeric( $dismissed ) && time() - $dismissed < 7 * DAY_IN_SECONDS ) {
            return;
        }
        $review_url = 'https://wordpress.org/support/plugin/easy-marijuana-age-verify/reviews/?rate=5#new-post';
        $remind_url = add_query_arg( 'emav_review_action', 'remind' );
        $dismiss_url = add_query_arg( 'emav_review_action', 'dismiss' );
        echo '<div class="notice notice-success is-dismissible">';
        echo '<p><strong>Enjoying Marijuana Age Verify?</strong> Please <a href="' . esc_url( $review_url ) . '" target="_blank">leave a 5-star review</a> to support us! 🙌</p>';
        echo '<p><a href="' . esc_url( $remind_url ) . '">Remind me later</a> | <a href="' . esc_url( $dismiss_url ) . '">Dismiss</a></p>';
        echo '</div>';
    } );
}