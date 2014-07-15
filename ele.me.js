/* ELEME Autorater , 0.1.Dotjs Ver */
/* A simple script can rate ele.me's order automatically */
/* Depends on Dotjs : https://github.com/defunkt/dotjs */
/* COMPATIBILITY : Your browser need support HTML5/CSS3 features (such as CSS3 animation) */

var pathrexp = /^\/profile\/order/i;
var debug = true;
var url = window.location.host;

/* Rating Parameters */
var rate_time = 40 ;
var rate_txt = '还不错';
var rate_attitd = '满意';
var rate_attnum = 3;
var rate_star = 5;
var rate_star_intro = "我的最爱";
var rate_star_txt = '还不错';

var is_rate = false;
var is_success = true;

var time_zh_tranf = ["正点", "5分钟", "10分钟", "15分钟", "20分钟", "25分钟", "30分钟", "35分钟", "40分钟", "45分钟", "50分钟", "55分钟", "1小时", "1小时5分钟", "1小时10分钟", "1小时15分钟", "1小时20分钟", "1小时25分钟", "1小时30分钟", "1小时35分钟", "1小时40分钟", "1小时45分钟", "1小时50分钟", "1小时55分钟", "2小时"];

/* Load external css file, for notification boxes' styles. */
$('<link>').attr({
	rel: 'stylesheet',
	type: 'text/css',
	href: 'http://www.grzhan.net/assets/css/ele.me.css'
}).appendTo('head');

/* ENTRY */
if (pathrexp.test(window.location.pathname)) {
    debug_log('Autorater Init: url path ele.me/profile/order matched!');
    document.onreadystatechange = function () {
    	if (document.readyState == "complete") {
    		main();
    	}
    }
}

function main() {
	/* Rating */
    var order_block = $('.main-content .order-list .order-block');
    if (order_block.length > 0) {
        order_block.each(function(){
            var order_name = $(this).find('.order-header .status a');
            if (order_name.length > 0) {
                debug_log('Autorater Processing : <' + order_name.text() + '>');
                var order_rate_speed = $(this).find('.order-rate:eq(0)');
                if (order_rate_speed.length > 0) {
                	var slider = order_rate_speed.find('.slider:eq(0)');
                	if (slider.length > 0) {
                		var button = order_rate_speed.find('.order-time-rating-save-btn');
                		if (button.length <=0) { error_layout('order-time-rating-save-btn'); return false;}
                		// var rate_time = rate_time; // h = 8 ; f[h]
                		var rate_id = button.attr('rel');
                		debug_log('>>> Setting order time rating ...');
                		$.get('http://' + url + '/profile/rate', {order_sn: rate_id, time: rate_time}, function(n){
                			if (undefined == n.point_change || n.point_change <= 0) {
                				error_api('/profile/rate');
                			} else {
                				debug_log('>>> ' + order_name.text() +' RATING SET SUCCESS !');
                				var col_content = order_rate_speed.find('.col-content');
                				if (col_content.length  <= 0) { error_layout('col_content'); return false;}
                				var col_value = order_rate_speed.find('.col-value');
                				if (col_value.length <= 0) { error_layout('col_value'); return false;}
                				is_rate = true;
                				col_value.remove();
                				col_content.empty();
                				col_content.html('已点评，时间：'+ time_zh_tranf[rate_time / 5] +' (by ele.me autorater)');
                			} // if undefined == n.point_change
                			return false;
                		});
                	} // if slider length
                } else {
                	error_layout('order_rate_speed');
                	return false;
                } // order_rate_speed

                var order_rate_satify = $(this).find('.order-rate:eq(1)');
                if (order_rate_satify.length > 0) {
                	var text_area = order_rate_satify.find('.order_service_textarea');
                	if (text_area.length > 0) {
	                	$.post('http://' + url + '/profile/orderServiceRate', { 
	                		id: text_area.attr('data-order-id'), 
	                	  	txt: rate_txt, 
	                	  	rating: rate_attnum
	                	}, function(p) {
	                		if (p.point_change !== undefined && p.point_change > 0) {
	                			var col_content = order_rate_satify.find('.col-content');
	                			if (col_content <=0) { error_layout('.col-content'); return false;}
	                			is_rate = true;
	                			col_content.empty();
	                			col_content.html('已点评， ' + rate_attitd + '(by ele.me autorater)');
	                		} else {
	                			error_api('/profile/orderServiceRate');
	                		}
	                	});
                	}
                } else {
                	error_layout('order_rate_satify');
                	return false;
                } // order_rate_satify

                var order_rate_backets = $(this).find('.order-table');
                if (order_rate_backets.length > 0) {
                	// http://ele.me/profile/orderItemRate/id/121419143/rating/5
                	// http://ele.me/profile/orderItemRateText 
                	var order_rate_tr = $(this).find('tbody tr');
                	if (order_rate_tr.length <= 0) { error_layout('order_rate_tr'); return false;}
                	var tr_flag = true;
                	order_rate_tr.each(function(){
                		var input_group = $(this).find('.col-rating .rating-input-group');
                		var rate_tr = $(this)
                		if (input_group.length > 0) { 
	                		var hover_txt = $(this).find('.col-rating .rating-hover-text');
	                		if (hover_txt.length <=0) { error_layout('hover_txt'); tr_flag = false; return false;}
	                		if (hover_txt.text() == '尚未打分') {
	                			$.getJSON('http://' + url + '/profile/orderItemRate/id/' 
	                			  + input_group.attr('rel') + '/rating/' + rate_star , function(state) {
	                			  	if (state.point_change != undefined) {
	                			  		$.post('http://' + url + '/profile/orderItemRateText' , {id: input_group.attr('rel'), txt: rate_star_txt});
	                			  		is_rate = true;
	                			  		var col_rating = rate_tr.find('.col-rating');
	                			  		col_rating.empty();
	                			  		col_rating.html('已评分: ' + rate_star_intro + " (by ele.me autorater)");
	                			  	} else {
	                			  		error_api('/profile/orderItemRate');
	                			  		tr_flag = false;
	                			  		return false;
	                			  	}
	                			}) ;
	                			if (!tr_flag) return false;
	                		}
                		} // input_group
                	});
                	if (!tr_flag) return false;
                } else {
                	error_layout('order_rate_backets');
                	return false;
                } // order_rate_brackets

            } else { 
                error_layout('order_name');
                return false;
            } // if (order_name)
        }); // each order_block

    	debug_log('Autorater Processing : All order_block processed.')
    	if (is_success && is_rate) {
    		notify_display('Ele.me Autorater rate successfully','','notify_success');
    	} else if (is_success) {
    		notify_display('Ele.me Autorater start normally','But there is no order need to be rated in this page','notify_info');
    	}
    } else {
        error_layout('order_block');
        return false;
    } // if order_block
}

function debug_log(message) {
    if (debug) {
        console.log(message);
    }
}

function error_layout(node_name) {
    console.error('Autorater Error: ' + node_name + ' not found!');
    console.error("Autorater Error: Target page's layout has changed, please contact author to update sciprt : grzhan@126.com");
    is_success = false;
    notify_display('Ele.me Autorater Layout Error :',"Target page's layout has changed, please contact author to update sciprt : grzhan@126.com",'notify_error');
}

function error_api(api) {
	console.error('Autorater Error: ' + api + ' error occured...');
	console.error("Autorater Error: Target website's api has changed, please contact author to update script: grzhan@126.com");
	is_success = false;
	notify_display('Ele.me Autorater API Error :',"Target website's api has changed, please contact author to update script: grzhan@126.com",'notify_error');
}

function notify_display(title,content,class_) {

	var notify_div =  $('<div></div>');
	notify_div.hide();
	notify_div.prependTo('.full-content-wrapper');
	notify_div.addClass('notify_message');
	notify_div.addClass(class_);

	var notify_title = $('<h3>');
	notify_title.text(title);
	notify_title.appendTo(notify_div);

	var notify_content = $('<p>');
	notify_content.text(content);
	notify_content.appendTo(notify_div);


	notify_div.slideDown('slow');
	setTimeout(function(){ notify_div.slideUp('slow');}, 5000);
}