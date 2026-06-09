jQuery(document).ready(function ($) {
	var emavbtn = document.getElementById("emav-clear-cookie");
	if ( typeof emavbtn !== 'undefined' && emavbtn !== null ) {
		if ( Cookies.get('emav-age-verified') === undefined ) {
			emavbtn.innerHTML = "No Cookie Set";
			emavbtn.disabled = true;
		} else {
			emavbtn.innerHTML = "Clear Your Cookie";
			emavbtn.disabled = false;
		}
	}

	// Page Targeting drop-down toggle
	// Get references to the radio buttons and dropdown
	var radioButtons = $('input[name="_emav_pagetargeting_option[option]"]');
	var dropdown = $('#_emav_pagetargeting_option');
	var pageLabel = $('#page-dropdown-label');
	// Function to toggle the visibility of the dropdown based on the selected radio button
	function toggleDropdownVisibility(speed) {
		// Check which radio button is selected
		var selectedOption = $('input[name="_emav_pagetargeting_option[option]"]:checked').val();
		// If the "Show on this page only" or "Show everywhere except this page" option is selected, show the dropdown
		if (selectedOption === 'include' || selectedOption === 'exclude') {
			if (speed === 'fast') {
				pageLabel.fadeIn(); // Fade in the label
				dropdown.fadeIn(); // Show the dropdown
			} else if (speed === 'slow') {
				pageLabel.fadeIn(); // Fade in the label
				dropdown.fadeIn(); // Show the dropdown
			}
		} else {
			if (speed === 'fast') {
			pageLabel.hide(); // Fade in the label
			dropdown.hide(); // Show the dropdown
		} else if (speed === 'slow') {
			pageLabel.fadeOut(); // Fade in the label
			dropdown.fadeOut(); // Show the dropdown
		}
		}
	}

	// Initial call to toggleDropdownVisibility to set initial visibility
	toggleDropdownVisibility('fast');

	// Add event listener to each radio button to listen for changes
	radioButtons.on('change', function() {
		toggleDropdownVisibility('slow');
	});

// Add an event listener for when the form is submitted
	 $('.emav-settings-form').on('submit', function() {
		  // Get the selected option
		  var option = $('input[name="_emav_pagetargeting_option[option]"]:checked').val();

		  // If the selected option is "include" or "exclude"
		  if (option === 'include' || option === 'exclude') {
				// Check if a page is selected
				var pageId = $('#_emav_pagetargeting_option').val();
				if (pageId === '0') {
					 // If no page is selected, display a warning message
					 alert('Please select a page.');
					 return false; // Prevent form submission
				}
		  }
	 });

	function toggleVerifyOptionFields(speed) {
		var selectedValue = $('input:radio[name=_emav_user_age_verify_option]:checked').val();
		var freeFormRows = [
			$('input[name=_emav_custom_age_text]').closest('tr'),
			$('input[name=_emav_custom_disagreebutton_text]').closest('tr'),
			$('input[name=_emav_disagree_error_text]').closest('tr')
		];
		var sharedRows = [
			$('input[name=_emav_custom_agreebutton_text]').closest('tr')
		];
		var noButtonColorRow = $('input[name=_emav_disAgree_btn_bgcolor]').closest('tr');
		var $freeFormHeading = $('h2:contains("Free-Form Custom Text")');
		var $birthdateSetting = $('.emav-birthdate-setting');
		var method = speed === 'slow' ? 'fade' : 'toggle';
		var showFreeForm = selectedValue == '6';
		var showBirthdate = selectedValue == '7';

		if (method === 'fade') {
			$freeFormHeading.stop(true, true)[showFreeForm ? 'fadeIn' : 'fadeOut']();
			$birthdateSetting.stop(true, true)[showBirthdate ? 'fadeIn' : 'fadeOut']();
			$.each(freeFormRows, function(_, $row) {
				$row.stop(true, true)[showFreeForm ? 'fadeIn' : 'fadeOut']();
			});
			$.each(sharedRows, function(_, $row) {
				$row.stop(true, true)[(showFreeForm || showBirthdate) ? 'fadeIn' : 'fadeOut']();
			});
			noButtonColorRow.stop(true, true)[showBirthdate ? 'fadeOut' : 'fadeIn']();
		} else {
			$freeFormHeading.toggle(showFreeForm);
			$birthdateSetting.toggle(showBirthdate);
			$.each(freeFormRows, function(_, $row) {
				$row.toggle(showFreeForm);
			});
			$.each(sharedRows, function(_, $row) {
				$row.toggle(showFreeForm || showBirthdate);
			});
			noButtonColorRow.toggle(!showBirthdate);
		}
	}

	toggleVerifyOptionFields('fast');
	$('input:radio[name=_emav_user_age_verify_option]').on('change', function() {
		toggleVerifyOptionFields('slow');
	});

	function toggleOverlayBoxFields(speed) {
		var isBoxEnabled = $('#_emav_overlay_box').is(':checked');
		var $boxColorRow = $('#_emav_box_bgcolor').closest('tr');
		var $boxGradientRow = $('#_emav_box_gradient').closest('tr');
		var $boxGradientEndRow = $('#_emav_box_gradient_end_color').closest('tr');
		var $boxGradientDirectionRow = $('#_emav_box_gradient_direction').closest('tr');
		var isBoxGradientEnabled = isBoxEnabled && $('#_emav_box_gradient').is(':checked');
		var $boxColorLabel = $('.emav-box-color-label');

		$boxColorLabel.text(isBoxGradientEnabled ? 'Box Gradient Start Color' : 'Box Background Color');

		if (speed === 'slow') {
			$boxColorRow.stop(true, true)[isBoxEnabled ? 'fadeIn' : 'fadeOut']();
			$boxGradientRow.stop(true, true)[isBoxEnabled ? 'fadeIn' : 'fadeOut']();
			$boxGradientEndRow.stop(true, true)[isBoxGradientEnabled ? 'fadeIn' : 'fadeOut']();
			$boxGradientDirectionRow.stop(true, true)[isBoxGradientEnabled ? 'fadeIn' : 'fadeOut']();
		} else {
			$boxColorRow.toggle(isBoxEnabled);
			$boxGradientRow.toggle(isBoxEnabled);
			$boxGradientEndRow.toggle(isBoxGradientEnabled);
			$boxGradientDirectionRow.toggle(isBoxGradientEnabled);
		}
	}

	toggleOverlayBoxFields('fast');
	$('#_emav_overlay_box').on('change', function() {
		toggleOverlayBoxFields('slow');
	});
	$('#_emav_box_gradient').on('change', function() {
		toggleOverlayBoxFields('slow');
	});

	function toggleGradientFields(speed) {
		var isGradientEnabled = $('#_emav_background_gradient').is(':checked');
		var $overlayColorLabel = $('.emav-overlay-color-label');
		var $gradientEndRow = $('#_emav_gradient_end_color').closest('tr');
		var $gradientDirectionRow = $('#_emav_gradient_direction').closest('tr');

		$overlayColorLabel.text(isGradientEnabled ? 'Gradient Start Color' : 'Background Color');

		if (speed === 'slow') {
			$gradientEndRow.stop(true, true)[isGradientEnabled ? 'fadeIn' : 'fadeOut']();
			$gradientDirectionRow.stop(true, true)[isGradientEnabled ? 'fadeIn' : 'fadeOut']();
		} else {
			$gradientEndRow.toggle(isGradientEnabled);
			$gradientDirectionRow.toggle(isGradientEnabled);
		}
	}

	toggleGradientFields('fast');
	$('#_emav_background_gradient').on('change', function() {
		toggleGradientFields('slow');
	});

	/* Testing the Logo Image onLoad */
	var csl_logo_url_val = $("#emav_logo_field_id").val();
	csl_logo_testImage(csl_logo_url_val);

	function csl_logo_testImage(URL) {
		if (URL != "Select Logo" && URL) {
			var tester = new Image();
			tester.onerror = csl_logo_imageNotFound;
			tester.src = URL;
		}
	}

	function csl_logo_imageNotFound() {
		alert("That image was not found.");
	}

	$('#emav_logo_button').click(function (e) {
		e.preventDefault();
		var csl_CustomSiteLogo_uploader = wp.media({
			title: 'Select or upload a logo',
			button: {text: 'Select Logo'},
			multiple: false
		}).on('select', function () {
			var attachment = csl_CustomSiteLogo_uploader.state().get('selection').first().toJSON();
			$('#emav_logo_field_id').val(attachment.url);
			$('.emav_logo_container').html("<IMG SRC='" + attachment.url + "'><BR>Save Changes to Set Logo");
		}).open();
	});

	$('#emav_logo_delete_button').click(function (e) {
		e.preventDefault();
		$('#emav_logo_field_id').val('');
		$('.emav_logo_container').html("Save Changes to Remove Logo");
	});

	$('#_emav_overlay_color').wpColorPicker();
	$('#_emav_gradient_end_color').wpColorPicker();
	$('#_emav_box_bgcolor').wpColorPicker();
	$('#_emav_box_gradient_end_color').wpColorPicker();
	$('#_emav_agree_btn_bgcolor').wpColorPicker();
	$('#_emav_disAgree_btn_bgcolor').wpColorPicker();
	// show character count
	$.fn.maxLen = function (maxLen) {
		var elm = $(this);
		var textSelector = Math.random().toString(10).substr(2);
		if (maxLen == null)
			var maxLen = $(elm).attr('maxlength');

		$(elm).after('<div id="txt-length-left' + textSelector + '"></div>');
		elm.keypress(function (event) {
			var Length = elm.val().length + 1;
			var AmountLeft = maxLen - Length;
			$('#txt-length-left' + textSelector).html(AmountLeft + " Characters left");
			if (Length - 1 >= maxLen) {
				$('#txt-length-left' + textSelector).html("0 Characters left");
				if (event.which != 8) {
					return false;
				}
			}
		});
	};

	// Disclaimer text box
	var $body = $('body');
	$body.find('#_emav_custom_age_text').maxLen();
	$body.find('#_emav_custom_agreebutton_text').maxLen();
	$body.find('#_emav_custom_disagreebutton_text').maxLen();
	$body.find('#_emav_disagree_error_text').maxLen();
	$body.find('#_emav_headline').maxLen();
	$body.find('#_emav_description').maxLen();
	$body.find('#_emav_heading').maxLen();
	$body.find('#_emav_disclaimer').maxLen();

	$('.emavpremhovertip').hover(function(e){ // Hover event
		var titleText = $(this).attr('title');
		$(this).data('tiptext', titleText).removeAttr('title');
		$('<p class="emavpremtooltip" style="display: none; z-index:999; position: absolute; padding: 10px; color: #555; background-color: #fff; border: 1px solid #777;	box-shadow: 0 1px 3px 1px rgba(0,0,0,0.5); border-radius: 3px;"></p>').text(titleText).appendTo('body').css('top', (e.pageY - 10) + 'px').css('left', (e.pageX + 20) + 'px').fadeIn('slow');
	}, function(){ // Hover off event
		$(this).attr('title', $(this).data('tiptext'));
		$('.emavpremtooltip').remove();
	}).mousemove(function(e){ // Mouse move event
		$('.emavpremtooltip').css('top', (e.pageY - 10) + 'px').css('left', (e.pageX + 20) + 'px');
	});

	$('.emavoptionshovertip').hover(function(e){ // Hover event
		var titleText = $(this).attr('title');
		$(this).data('tiptext', titleText).removeAttr('title');
		$('<p class="emavoptiontooltip"></p>').text(titleText).appendTo('body').css('top', ($(this).offset().top  - 25) + 'px').css('left', ($(this).offset().left + 5 ) + 'px').fadeIn('slow');
	}, function(){ // Hover off event
		$(this).attr('title', $(this).data('tiptext'));
		$('.emavoptiontooltip').remove();
	});


});

function emav_clear_cookie() {
	var emavbtn = document.getElementById("emav-clear-cookie");
	console.debug('Clearing cookie!');
	document.cookie='emav-age-verified=;Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	console.debug('Cleared!');
	emavbtn.innerHTML = "Cookie Cleared";
	emavbtn.disabled = true;
	setTimeout(function(){
		emavbtn.innerHTML = "No Cookie Set";
	}, 4000);
	return false;
}

// Embed jQuery js-cookies file to remove remote call
/*!
 * JavaScript Cookie v2.2.1
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/js-cookie@2.2.1/src/js.cookie.js
 */
!function(e){var n;if("function"==typeof define&&define.amd&&(define(e),n=!0),"object"==typeof exports&&(module.exports=e(),n=!0),!n){var t=window.Cookies,o=window.Cookies=e();o.noConflict=function(){return window.Cookies=t,o}}}(function(){function e(){for(var e=0,n={};e<arguments.length;e++){var t=arguments[e];for(var o in t)n[o]=t[o]}return n}function n(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function t(o){function r(){}function i(n,t,i){if("undefined"!=typeof document){"number"==typeof(i=e({path:"/"},r.defaults,i)).expires&&(i.expires=new Date(1*new Date+864e5*i.expires)),i.expires=i.expires?i.expires.toUTCString():"";try{var c=JSON.stringify(t);/^[\{\[]/.test(c)&&(t=c)}catch(e){}t=o.write?o.write(t,n):encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var f="";for(var u in i)i[u]&&(f+="; "+u,!0!==i[u]&&(f+="="+i[u].split(";")[0]));return document.cookie=n+"="+t+f}}function c(e,t){if("undefined"!=typeof document){for(var r={},i=document.cookie?document.cookie.split("; "):[],c=0;c<i.length;c++){var f=i[c].split("="),u=f.slice(1).join("=");t||'"'!==u.charAt(0)||(u=u.slice(1,-1));try{var a=n(f[0]);if(u=(o.read||o)(u,a)||n(u),t)try{u=JSON.parse(u)}catch(e){}if(r[a]=u,e===a)break}catch(e){}}return e?r[e]:r}}return r.set=i,r.get=function(e){return c(e,!1)},r.getJSON=function(e){return c(e,!0)},r.remove=function(n,t){i(n,"",e(t,{expires:-1}))},r.defaults={},r.withConverter=t,r}(function(){})});
