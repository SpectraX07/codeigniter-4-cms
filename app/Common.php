<?php

/**
 * The goal of this file is to allow developers a location
 * where they can overwrite core procedural functions and
 * replace them with their own. This file is loaded during
 * the bootstrap process and is called during the framework's
 * execution.
 *
 * This can be looked at as a `master helper` file that is
 * loaded early on, and may also contain additional functions
 * that you'd like to use throughout your entire application
 *
 * @see: https://codeigniter.com/user_guide/extending/common.html
 */


if (!function_exists('adminAsset')) {
    function adminAsset(string $url = ''): string
    {
        return site_url("backend/$url");
    }
}

if (!function_exists('commonAsset')) {
    function commonAsset(string $fileName = ''): string
    {
        return site_url("common/{$fileName}");
    }
}

if (!function_exists('dependencies')) {
    function dependencies(string $fileName = ''): string
    {
        return site_url("dependencies/{$fileName}");
    }
}

if (!function_exists('setFlashMessage')) {
    /**
     * Set flash message data.
     *
     * @param string $message The message to be flashed.
     * @param string $title The title of the flash message. Default is 'Error'.
     * @param string $messageType The type of the flash message. Default is 'error'.
     * @return void
     */
    function setFlashMessage(string $message, string $title = 'Error', string $messageType = 'error'): void
    {
        session()->setFlashData([
            'message' => $message,
            'title' => $title,
            'messageType' => $messageType
        ]);
    }
}

if (!function_exists('uploadUrl')) {
    function uploadUrl(string $fileName = ''): string
    {
        return site_url("uploads/{$fileName}");
    }
}

if (!function_exists('adminUrl')) {
    function adminUrl(string $urlPart = ''): string
    {
        return site_url(ADMIN_URL . "/{$urlPart}");
    }
}