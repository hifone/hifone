(function(){window.ForumView=Backbone.View.extend({el:"body",currentPageImageURLs:[],clearHightTimer:null,events:{"click a.likeable":"likeable","click a.followable":"followable","click a.favoriteable":"favoriteable","click a.captcha-image-box":"reLoadCaptchaImage","click a.btn-reply2reply":"reply2reply"},initialize:function(e){return this.parentView=e.parentView,this.initPjax(),this.initComponents()},initComponents:function(){var e;return e=this,Hifone.initAjax(),Hifone.initTextareaAutoResize(),Hifone.initDeleteForm(),e.initScrollToTop(),e.forceImageDataType(),e.initLightBox(),e.initEmoji(),e.initExternalLink(),e.initToolTips(),e.initHighLight(),e.initTimeAgo(),e.initSelect2(),e.initInlineAttach(),e.initEditorUploader(),e.initAutocompleteAtUser(),e.initEditorPreview(),e.initLocalStorage(),e.uploadAvatar()},initPjax:function(){var e;e=this,$(document).pjax('a:not(a[target="_blank"],a[data-pjax="no"])',".forum"),$(document).on("pjax:start",function(){NProgress.start()}),$(document).on("pjax:end",function(){NProgress.done(),e.initComponents(),console.log("in pjax")}),$(document).on("pjax:complete",function(){NProgress.done()})},initScrollToTop:function(){return $.scrollUp.init()},initSelect2:function(){$(".selectpicker").select2({theme:"classic"}),$(".js-tag-tokenizer").select2({tags:!0,tokenSeparators:[","," "]})},initExternalLink:function(){$('a[href^="http://"], a[href^="https://"]').each(function(){var e;e=new RegExp("/"+window.location.host+"/"),e.test(this.href)||$(this).click(function(e){e.preventDefault(),e.stopPropagation(),window.open(this.href,"_blank")})})},forceImageDataType:function(){$(".content-body img:not(.emoji)").each(function(){$(this).attr("data-type","image").attr("data-remote",$(this).attr("src"))})},initLightBox:function(){$(".content-body").delegate("img:not(.emoji)","click",function(e){return e.preventDefault(),$(this).ekkoLightbox({onShown:function(){return console.log("Checking our the events huh?")}})})},initEmoji:function(){emojify.setConfig({img_dir:Hifone.Config.emoj_cdn+"/assets/images/emoji",ignored_tags:{SCRIPT:1,TEXTAREA:1,A:1,PRE:1,CODE:1}}),emojify.run(),$("#body_field").textcomplete([{match:/\B:([\-+\w]*)$/,search:function(e,t){t($.map(emojies,function(t){return 0===t.indexOf(e)?t:null}))},template:function(e){return'<img src="'+Hifone.Config.emoj_cdn+"/assets/images/emoji/"+e+'.png"></img>'+e},replace:function(e){return":"+e+": "},index:1,maxCount:5}])},initHighLight:function(){Prism.highlightAll()},initToolTips:function(){$('[data-toggle="tooltip"]').tooltip()},initInlineAttach:function(){$("#body_field").inlineattach({uploadUrl:Hifone.Config.uploader_url,extraParams:{_token:Hifone.Config.token},onUploadedFile:function(e){}})},initTimeAgo:function(){moment.locale(Hifone.Config.locale),$(".timeago").each(function(){var e;e=$(this).text(),moment(e,"YYYY-MM-DD HH:mm:ss",!0).isValid()&&$(this).text(moment(e).fromNow())})},initEditorUploader:function(){var e;e=this,$(".btn-upload").click(function(){$(".input-file").click()}),$(".input-file").change(function(){var t,o,a,i,n,r;return t=$(".create_form"),a=new FormData(t[0]),i="![Uploading file...]()",r="![file]({filename})",o="{filename}",n=$(".post-editor"),$.ajax({url:Hifone.Config.uploader_url,type:"POST",data:a,cache:!1,contentType:!1,processData:!1,beforeSend:function(){$(".btn-upload").attr("disabled","disabled"),e._caretPos(n,i,0)},success:function(e){var t;t=n.val().replace(i,r.replace(o,e.filename)),n.val(t)},error:function(e){var t;t=n.val().replace(i,""),n.val(t)},complete:function(){$(".btn-upload").removeAttr("disabled")}},"json"),!1})},initEditorPreview:function(){var e;e=this,$(".insert-codes a").on("click",function(){return e.appendCodesFromHint($(this))}),e.hookPreview($(".editor-toolbar"),$(".post-editor"))},initAutocompleteAtUser:function(){var e,t,o,a;for(t=[],a=void 0,e=$(".media-heading").find("a.author"),o=0;o<e.length;)a=e.eq(o).text().trim(),$.inArray(a,t)===-1&&t.push(a),o++;$("textarea").textcomplete([{mentions:t,match:/\B@(\w*)$/,search:function(e,t){t($.map(this.mentions,function(t){return 0===t.indexOf(e)?t:null}))},index:1,replace:function(e){return"@"+e+" "}}],{appendTo:"body"})},preview:function(e){var t,o;$("#preview-box").text("Loading..."),o=$("#body_field"),t=o.val(),t?marked(t,function(e,t){$("#preview-box").html(t),emojify.run(document.getElementById("preview-box"))}):$("#preview-box").text("Content is empty.")},hookPreview:function(e,t){var o,a;return a=this,o=$(document.createElement("div")).attr("id","preview-box"),o.addClass("box preview markdown-reply"),$(t).after(o),o.hide(),$(".edit a",e).click(function(){return $(".preview",e).removeClass("active"),$(this).parent().addClass("active"),$(o).hide(),$(t).show(),$(".status-post-submit").show(),$("#editor-toolbar-insert-code").show(),$(".btn-upload").show(),!1}),$(".preview a",e).click(function(){return $(".edit",e).removeClass("active"),$(this).parent().addClass("active"),$(o).show(),$(t).hide(),$(".status-post-submit").hide(),$("#editor-toolbar-insert-code").hide(),$(".btn-upload").hide(),a.preview($(t).val()),!1})},appendCodesFromHint:function(e){var t,o,a,i,n,r,l,s,c;return r=this,t=void 0,o=void 0,a=void 0,n=void 0,l=void 0,s=void 0,c=void 0,a=e.data("lang"),c=$(".post-editor"),i="\n```"+a+"\n\n```",r._caretPos(c,i,5),c.focus(),c.trigger("click"),!1},_caretPos:function(e,t,o){var a,i,n,r;i=e.caret(),r=t+"\n",n=e.val(),a=n.slice(0,i),e.val(a+r+n.slice(i+1,n.count)),e.caret(i+r.length-o)},initLocalStorage:function(){console.log("call initLocalStorage"),$("#body_field").focus(function(e){localforage.getItem("thread_title",function(e,t){""!==$("#thread_create_form #thread_title").val()||e||$("#thread_create_form #thread_title").val(t)}),$("#thread_create_form #thread_title").keyup(function(){localforage.setItem("thread_title",$(this).val())}),localforage.getItem("thread_create_body",function(e,t){""!==$("#thread_create_form #body_field").val()||e||$("#thread_create_form #body_field").val(t)}),$("#thread_create_form #body_field").keyup(function(){localforage.setItem("thread_create_body",$(this).val())}),localforage.getItem("reply_create_body",function(e,t){""!==$("#reply_create_form #body_field").val()||e||$("#reply_create_form #body_field").val(t)}),$("#reply_create_form #body_field").keyup(function(){localforage.setItem("reply_create_body",$(this).val())})}),$("#thread_create_form").submit(function(e){localforage.removeItem("thread_create_body"),localforage.removeItem("thread_title")}),$("#reply_create_form").submit(function(e){localforage.removeItem("reply_create_body")})},reply2reply:function(e){var t,o,a,i,n,r;return t=$(e.target),r=t.data("username"),n=$("#body_field"),a=n.val(),i="@"+r+" ",o="",a.length>0?a!==i&&(o=a+"\n"+i):o=i,n.focus().val(n.val()+o),!1},uploadAvatar:function(){$(".upload-btn").on("click",function(){$("#avatarinput").click()}),$("#avatarinput").change(function(){$("#avatarinput-submit").click()})},likeable:function(e){var t,o,a,i,n;return Hifone.isLogined()?(t=$(e.currentTarget),i=t.data("type"),a=t.data("id"),o=t.data("action"),n=t.data("url"),$.ajax({url:n,type:"like"===o?"POST":"DELETE",data:{type:i,id:a},success:function(e){console.log(e.status),t.text("like"===o?"已赞":"已踩")},error:function(e){console.log("error")}},"json")):(location.href="/auth/login",!1)},followable:function(e){var t,o,a,i,n;return Hifone.isLogined()?(t=$(e.currentTarget),i=t.data("type"),a=t.data("id"),o=t.data("action"),n=t.data("url"),console.log("followable"),$.ajax({url:n,type:"POST",data:{type:i,id:a},success:function(e){t.hasClass("active")?t.removeClass("active"):t.addClass("active"),$.notifier.notify("Operation ran successfully.","success")},error:function(e){return console.log("error"),$.notifier.notify("An error occurred.","error")}},"json"),!1):(location.href="/auth/login",!1)},favoriteable:function(e){var t,o,a,i;return Hifone.needLogined(),t=$(e.currentTarget),a=t.data("type"),o=t.data("id"),i=t.data("url"),console.log("favoriteable"),$.ajax({url:i,type:"POST",data:{type:a,id:o},success:function(e){$.notifier.notify("Operation ran successfully.","success"),t.hasClass("active")?t.removeClass("active"):t.addClass("active")},error:function(e){return console.log("error"),$.notifier.notify("An error occurred.","error")}},"json"),!1},reLoadCaptchaImage:function(e){var t,o,a;return t=$(e.currentTarget),a=t.find("img:first"),o=a.attr("src"),a.attr("src",o.split("?")[0]+"?"+(new Date).getTime()),!1}})}).call(this),function(){var e;e=Backbone.View.extend({el:"body",repliesPerPage:50,windowInActive:!0,initialize:function(){var e,t;if(this.initComponents(),"forum"===(e=$("body").data("page"))&&(window._forumView=new ForumView({parentView:this})),"install"===(t=$("body").data("page")))return window._installView=new InstallView({parentView:this})},initComponents:function(){return $(".alert").alert(),$(".dropdown-toggle").dropdown(),$(".bootstrap-select").remove(),$(".post-editor textarea").unbind("keydown"),$(".post-editor textarea").bind("keydown","ctrl+return",function(e){return $(e.target).val().trim().length>0&&$(e.target).parent().parent().submit(),!1}),$(window).off("blur.inactive focus.inactive"),$(window).on("blur.inactive focus.inactive",this.updateWindowActiveState)},updateWindowActiveState:function(e){var t;if(t=$(this).data("prevType"),t!==e.type)switch(e.type){case"blur":this.windowInActive=!1;break;case"focus":this.windowInActive=!0}return $(this).data("prevType",e.type)}}),window.Hifone={Config:{locale:"zh-CN",current_user_id:null,token:"",emoj_cdn:"",notification_url:"",uploader_url:"",asset_url:"",root_url:""},isLogined:function(){return null!==Hifone.Config.current_user_id},needLogined:function(){if(!Hifone.isLogined())return location.href="/auth/login",!1},loading:function(){return console.log("loading...")},fixUrlDash:function(e){return e.replace(/\/\//g,"/").replace(/:\//,"://")},alert:function(e,t){return $(".alert").remove(),$(t).before("<div class='alert alert-warning'><a class='close' href='#' data-dismiss='alert'>X</a>"+e+"</div>")},notice:function(e,t){return $(".alert").remove(),$(t).before("<div class='alert alert-success'><a class='close' data-dismiss='alert' href='#'>X</a>"+e+"</div>")},openUrl:function(e){return window.open(e)},initTextareaAutoResize:function(){$("textarea").autosize()},initAjax:function(){$.ajaxPrefilter(function(e,t,o){var a;return a=null,e.crossDomain||(a=$('meta[name="token"]').attr("content"),a&&o.setRequestHeader("X-CSRF-Token",a)),o}),$.ajaxSetup({beforeSend:function(e){e.setRequestHeader("Accept","application/json")}}),$("form").submit(function(){var e;e=$(this),e.find(":submit").prop("disabled",!0)})},initDeleteForm:function(){$("[data-method]").append(function(){var e;return e=$(this).attr("data-url"),"\n<form action='"+e+"' method='POST' style='display:none'>\n   <input type='hidden' name='_method' value='"+$(this).attr("data-method")+"'>\n   <input type='hidden' name='_token' value='"+Hifone.Config.token+"'>\n</form>\n"}).attr("style","cursor:pointer;").removeAttr("href").click(function(){var e;e=$(this),e.hasClass("confirm-action")?swal({type:"warning",title:"Confirm your action",text:"Are you sure you want to do this?",confirmButtonText:"Yes",confirmButtonColor:"#FF6F6F",showCancelButton:!0},function(){e.find("form").submit()}):e.find("form").submit()})}},$(function(){return window._hifoneView=new e})}.call(this),function(){window.InstallView=Backbone.View.extend({el:"body",events:{"click .wizard-next":"wizard"},initialize:function(e){return this.parentView=e.parentView,this.initComponents()},initComponents:function(){var e;return e=this,console.log("in install"),Hifone.initAjax()},wizard:function(e){var t,o,a,i,n,r;return n=this,o=$(e.target),t=$("#install-form"),a=o.data("currentBlock"),i=o.data("nextBlock"),o.button("loading"),i>a?(r="/install/step"+a,$.post(r,t.serializeObject()).done(function(e){n.goToStep(a,i)}).fail(function(e){var t;t=_.toArray(e.responseJSON.errors),_.each(t,function(e){$.notifier.notify(e)})}).always(function(){o.button("reset")}),!1):(n.goToStep(a,i),o.button("reset"))},goToStep:function(e,t){$(".block-"+e).removeClass("show").addClass("hidden"),$(".block-"+t).removeClass("hidden").addClass("show"),$(".steps .step").removeClass("active").filter(":lt("+(t+1)+")").addClass("active")}})}.call(this),function(){var e,t=function(e,t){return function(){return e.apply(t,arguments)}};e=function(){function e(){this.initMessenger=t(this.initMessenger,this),this.initMessenger()}return e.prototype.initMessenger=function(){Messenger.options={extraClasses:"messenger-fixed messenger-on-top",theme:"air"}},e.prototype.notify=function(e,t,o){var a;return _.isPlainObject(e)&&(e=e.detail),t="undefined"==typeof t||"error"===t?"error":t,a={message:e,type:t,showCloseButton:!0},o=_.extend(a,o),Messenger().post(o)},e}(),jQuery.notifier=new e}.call(this),function(){window.emojies=["+1","-1","100","1234","8ball","a","ab","abc","abcd","accept","aerial_tramway","airplane","alarm_clock","alien","ambulance","anchor","angel","anger","angry","anguished","ant","apple","aquarius","aries","arrow_backward","arrow_double_down","arrow_double_up","arrow_down","arrow_down_small","arrow_forward","arrow_heading_down","arrow_heading_up","arrow_left","arrow_lower_left","arrow_lower_right","arrow_right","arrow_right_hook","arrow_up","arrow_up_down","arrow_up_small","arrow_upper_left","arrow_upper_right","arrows_clockwise","arrows_counterclockwise","art","articulated_lorry","astonished","athletic_shoe","atm","b","baby","baby_bottle","baby_chick","baby_symbol","back","baggage_claim","balloon","ballot_box_with_check","bamboo","banana","bangbang","bank","bar_chart","barber","baseball","basketball","bath","bathtub","battery","bear","bee","beer","beers","beetle","beginner","bell","bento","bicyclist","bike","bikini","bird","birthday","black_circle","black_joker","black_large_square","black_medium_small_square","black_medium_square","black_nib","black_small_square","black_square_button","blossom","blowfish","blue_book","blue_car","blue_heart","blush","boar","boat","bomb","book","bookmark","bookmark_tabs","books","boom","boot","bouquet","bow","bowling","bowtie","boy","bread","bride_with_veil","bridge_at_night","briefcase","broken_heart","bug","bulb","bullettrain_front","bullettrain_side","bus","busstop","bust_in_silhouette","busts_in_silhouette","cactus","cake","calendar","calling","camel","camera","cancer","candy","capital_abcd","capricorn","car","card_index","carousel_horse","cat","cat2","cd","chart","chart_with_downwards_trend","chart_with_upwards_trend","checkered_flag","cherries","cherry_blossom","chestnut","chicken","children_crossing","chocolate_bar","christmas_tree","church","cinema","circus_tent","city_sunrise","city_sunset","cl","clap","clapper","clipboard","clock1","clock10","clock1030","clock11","clock1130","clock12","clock1230","clock130","clock2","clock230","clock3","clock330","clock4","clock430","clock5","clock530","clock6","clock630","clock7","clock730","clock8","clock830","clock9","clock930","closed_book","closed_lock_with_key","closed_umbrella","cloud","clubs","cn","cocktail","coffee","cold_sweat","collision","computer","confetti_ball","confounded","confused","congratulations","construction","construction_worker","convenience_store","cookie","cool","cop","copyright","corn","couple","couple_with_heart","couplekiss","cow","cow2","credit_card","crescent_moon","crocodile","crossed_flags","crown","cry","crying_cat_face","crystal_ball","cupid","curly_loop","currency_exchange","curry","custard","customs","cyclone","dancer","dancers","dango","dart","dash","date","de","deciduous_tree","department_store","diamond_shape_with_a_dot_inside","diamonds","disappointed","disappointed_relieved","dizzy","dizzy_face","do_not_litter","dog","dog2","dollar","dolls","dolphin","door","doughnut","dragon","dragon_face","dress","dromedary_camel","droplet","dvd","e-mail","ear","ear_of_rice","earth_africa","earth_americas","earth_asia","egg","eggplant","eight","eight_pointed_black_star","eight_spoked_asterisk","electric_plug","elephant","email","end","envelope","envelope_with_arrow","es","euro","european_castle","european_post_office","evergreen_tree","exclamation","expressionless","eyeglasses","eyes","facepunch","factory","fallen_leaf","family","fast_forward","fax","fearful","feelsgood","feet","ferris_wheel","file_folder","finnadie","fire","fire_engine","fireworks","first_quarter_moon","first_quarter_moon_with_face","fish","fish_cake","fishing_pole_and_fish","fist","five","flags","flashlight","floppy_disk","flower_playing_cards","flushed","foggy","football","footprints","fork_and_knife","fountain","four","four_leaf_clover","fr","free","fried_shrimp","fries","frog","frowning","fu","fuelpump","full_moon","full_moon_with_face","game_die","gb","gem","gemini","ghost","gift","gift_heart","girl","globe_with_meridians","goat","goberserk","godmode","golf","grapes","green_apple","green_book","green_heart","grey_exclamation","grey_question","grimacing","grin","grinning","guardsman","guitar","gun","haircut","hamburger","hammer","hamster","hand","handbag","hankey","hash","hatched_chick","hatching_chick","headphones","hear_no_evil","heart","heart_decoration","heart_eyes","heart_eyes_cat","heartbeat","heartpulse","hearts","heavy_check_mark","heavy_division_sign","heavy_dollar_sign","heavy_exclamation_mark","heavy_minus_sign","heavy_multiplication_x","heavy_plus_sign","helicopter","herb","hibiscus","high_brightness","high_heel","hocho","honey_pot","honeybee","horse","horse_racing","hospital","hotel","hotsprings","hourglass","hourglass_flowing_sand","house","house_with_garden","hurtrealbad","hushed","ice_cream","icecream","id","ideograph_advantage","imp","inbox_tray","incoming_envelope","information_desk_person","information_source","innocent","interrobang","iphone","it","izakaya_lantern","jack_o_lantern","japan","japanese_castle","japanese_goblin","japanese_ogre","jeans","joy","joy_cat","jp","key","keycap_ten","kimono","kiss","kissing","kissing_cat","kissing_closed_eyes","kissing_heart","kissing_smiling_eyes","koala","koko","kr","lantern","large_blue_circle","large_blue_diamond","large_orange_diamond","last_quarter_moon","last_quarter_moon_with_face","laughing","leaves","ledger","left_luggage","left_right_arrow","leftwards_arrow_with_hook","lemon","leo","leopard","libra","light_rail","link","lips","lipstick","lock","lock_with_ink_pen","lollipop","loop","loudspeaker","love_hotel","love_letter","low_brightness","m","mag","mag_right","mahjong","mailbox","mailbox_closed","mailbox_with_mail","mailbox_with_no_mail","man","man_with_gua_pi_mao","man_with_turban","mans_shoe","maple_leaf","mask","massage","meat_on_bone","mega","melon","memo","mens","metal","metro","microphone","microscope","milky_way","minibus","minidisc","mobile_phone_off","money_with_wings","moneybag","monkey","monkey_face","monorail","moon","mortar_board","mount_fuji","mountain_bicyclist","mountain_cableway","mountain_railway","mouse","mouse2","movie_camera","moyai","muscle","mushroom","musical_keyboard","musical_note","musical_score","mute","nail_care","name_badge","neckbeard","necktie","negative_squared_cross_mark","neutral_face","new","new_moon","new_moon_with_face","newspaper","ng","nine","no_bell","no_bicycles","no_entry","no_entry_sign","no_good","no_mobile_phones","no_mouth","no_pedestrians","no_smoking","non-potable_water","nose","notebook","notebook_with_decorative_cover","notes","nut_and_bolt","o","o2","ocean","octocat","octopus","oden","office","ok","ok_hand","ok_woman","older_man","older_woman","on","oncoming_automobile","oncoming_bus","oncoming_police_car","oncoming_taxi","one","open_book","open_file_folder","open_hands","open_mouth","ophiuchus","orange_book","outbox_tray","ox","package","page_facing_up","page_with_curl","pager","palm_tree","panda_face","paperclip","parking","part_alternation_mark","partly_sunny","passport_control","paw_prints","peach","pear","pencil","pencil2","penguin","pensive","performing_arts","persevere","person_frowning","person_with_blond_hair","person_with_pouting_face","phone","pig","pig2","pig_nose","pill","pineapple","pisces","pizza","point_down","point_left","point_right","point_up","point_up_2","police_car","poodle","poop","post_office","postal_horn","postbox","potable_water","pouch","poultry_leg","pound","pouting_cat","pray","princess","punch","purple_heart","purse","pushpin","put_litter_in_its_place","question","rabbit","rabbit2","racehorse","radio","radio_button","rage","rage1","rage2","rage3","rage4","railway_car","rainbow","raised_hand","raised_hands","raising_hand","ram","ramen","rat","recycle","red_car","red_circle","registered","relaxed","relieved","repeat","repeat_one","restroom","revolving_hearts","rewind","ribbon","rice","rice_ball","rice_cracker","rice_scene","ring","rocket","roller_coaster","rooster","rose","rotating_light","round_pushpin","rowboat","ru","rugby_football","runner","running","running_shirt_with_sash","sa","sagittarius","sailboat","sake","sandal","santa","satellite","satisfied","saxophone","school","school_satchel","scissors","scorpius","scream","scream_cat","scroll","seat","secret","see_no_evil","seedling","seven","shaved_ice","sheep","shell","ship","shipit","shirt","shit","shoe","shower","signal_strength","six","six_pointed_star","ski","skull","sleeping","sleepy","slot_machine","small_blue_diamond","small_orange_diamond","small_red_triangle","small_red_triangle_down","smile","smile_cat","smiley","smiley_cat","smiling_imp","smirk","smirk_cat","smoking","snail","snake","snowboarder","snowflake","snowman","sob","soccer","soon","sos","sound","space_invader","spades","spaghetti","sparkle","sparkler","sparkles","sparkling_heart","speak_no_evil","speaker","speech_balloon","speedboat","squirrel","star","star2","stars","station","statue_of_liberty","steam_locomotive","stew","straight_ruler","strawberry","stuck_out_tongue","stuck_out_tongue_closed_eyes","stuck_out_tongue_winking_eye","sun_with_face","sunflower","sunglasses","sunny","sunrise","sunrise_over_mountains","surfer","sushi","suspect","suspension_railway","sweat","sweat_drops","sweat_smile","sweet_potato","swimmer","symbols","syringe","tada","tanabata_tree","tangerine","taurus","taxi","tea","telephone","telephone_receiver","telescope","tennis","tent","thought_balloon","three","thumbsdown","thumbsup","ticket","tiger","tiger2","tired_face","tm","toilet","tokyo_tower","tomato","tongue","top","tophat","tractor","traffic_light","train","train2","tram","triangular_flag_on_post","triangular_ruler","trident","triumph","trolleybus","trollface","trophy","tropical_drink","tropical_fish","truck","trumpet","tshirt","tulip","turtle","tv","twisted_rightwards_arrows","two","two_hearts","two_men_holding_hands","two_women_holding_hands","u5272","u5408","u55b6","u6307","u6708","u6709","u6e80","u7121","u7533","u7981","u7a7a","uk","umbrella","unamused","underage","unlock","up","us","v","vertical_traffic_light","vhs","vibration_mode","video_camera","video_game","violin","virgo","volcano","vs","walking","waning_crescent_moon","waning_gibbous_moon","warning","watch","water_buffalo","watermelon","wave","wavy_dash","waxing_crescent_moon","waxing_gibbous_moon","wc","weary","wedding","whale","whale2","wheelchair","white_check_mark","white_circle","white_flower","white_large_square","white_medium_small_square","white_medium_square","white_small_square","white_square_button","wind_chime","wine_glass","wink","wolf","woman","womans_clothes","womans_hat","womens","worried","wrench","x","yellow_heart","yen","yum","zap","zero","zzz"]}.call(this);