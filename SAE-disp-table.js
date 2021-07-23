SAE = SAE || {};

SAE.disp = SAE.disp || {};

SAE.disp.table = [
	// 基础scratch积木
	/*{{{*/

	// 基本文字
	"#[空白]",				"::::",					-99,
	"#[文本]",				"%0",					-99,
	"#[变量]",				"(%0)",					-99,
	"#[列表]",				"[%0]",					-99,
	"#[参数]",				"{%0}",					-99,
	"#[布尔参数]",				"<%0>",					-99,
	"#[选项]",				"[%0 v]",				-99,

	//动作
	"#motion_movesteps",			"移动 %1 步",				0,
	"#motion_turnright",			"右转 %1 度",				0,
	"#motion_turnleft",			"左转 %1 度",				0,
	"#motion_goto",				"移到 %1",				0,
	"#motion_goto_menu",			"($1)",					0,
	"#motion_gotoxy",			"移到 x: %1 y: %2",			0,
	"#motion_glideto",			"在 $2 秒内滑行到 %1",			0,
	"#motion_glideto_menu",			"($1)",					0,
	"#motion_glidesecstoxy",		"在 $3 秒内滑行到 x: %1 y: %2",		0,
	"#motion_pointindirection",		"面向 %1 方向",				0,
	"#motion_pointtowards",			"面向 %1",				0,
	"#motion_pointtowards_menu",		"($1)",					0,
	"#motion_changexby",			"将x坐标增加 %1",			0,
	"#motion_setx",				"将x坐标设为 %1",			0,
	"#motion_changeyby",			"将y坐标增加 %1",			0,
	"#motion_sety",				"将y坐标设为 %1",			0,
	"#motion_ifonedgebounce",		"碰到边缘就反弹",			0,
	"#motion_setrotationstyle",		"将旋转方式设为 &1",			0,
	"#motion_direction",			"(方向)",				99,
	"#motion_yposition",			"(x坐标)",				99,
	"#motion_xposition",			"(y坐标)",				99,

	"&motion_setrotationstyle:left-right",	"左右翻转",
	"&motion_setrotationstyle:don't rotate","不可旋转",
	"&motion_setrotationstyle:all around",	"任意旋转",

	//外观
	"#looks_sayforsecs",			"说 %1 %2 秒",				0,
	"#looks_say",				"说 %1",				0,
	"#looks_thinkforsecs",			"思考 %1 %2 秒",			0,
	"#looks_think",				"思考 %1",				0,
	"#looks_switchcostumeto",		"换成 %1 造型",				0,
	"#looks_costume",			"($1)",					0,
	"#looks_nextcostume",			"下一个造型",				0,
	"#looks_switchbackdropto",		"换成 %1 背景",				0,
	"#looks_backdrops",			"($1)",					0,
	"#looks_nextbackdrop",			"下一个背景",				0,
	"#looks_changesizeby",			"将大小增加 %1",			0,
	"#looks_setsizeto",			"将大小设为 %1",			0,
	"#looks_changeeffectby",		"将 &2 特效增加 %1",			0,
	"#looks_seteffectto",			"将 &2 特效设定为 %1",			0,
	"#looks_cleargraphiceffects",		"清除图形特效",				0,
	"#looks_show",				"显示",					0,
	"#looks_hide",				"隐藏",					0,
	"#looks_gotofrontback",			"移到最 &1",				0,
	"#looks_goforwardbackwardlayers",	"&2 %1 层",				0,
	"#looks_costumenumbername",		"(造型 &1)",				99,
	"#looks_backdropnumbername",		"(背景 &1)",				99,
	"#looks_size",				"(大小)",				99,

	"&looks_changeeffectby:COLOR",		"颜色",
	"&looks_changeeffectby:FISHEYE",	"鱼眼",
	"&looks_changeeffectby:WHIRL",		"漩涡",
	"&looks_changeeffectby:PIXELATE",	"像素化",
	"&looks_changeeffectby:MOSAIC",		"马赛克",
	"&looks_changeeffectby:BRIGHTNESS",	"亮度",
	"&looks_seteffectto:GHOST",		"虚像",
	"&looks_gotofrontback:front",		"前面",
	"&looks_gotofrontback:back",		"后面",
	"&looks_goforwardbackwardlayers:forward","前移",
	"&looks_goforwardbackwardlayers:backward","后移",
	"&looks_costumenumbername:number",	"编号",
	"&looks_backdropnumbername:number",	"编号",
	"&looks_costumenumbername:name",	"名称",
	"&looks_backdropnumbername:name",	"名称",

	//声音
	"#sound_playuntildone",			"播放声音 %1 等待播完",			0,
	"#sound_sounds_menu",			"播放声音 %1",				0,
	"#sound_play",				"(%1)",					99,
	"#sound_stopallsounds",			"停止所有声音",				0,
	"#sound_changeeffectby",		"将 &2 音效增加 %1",			0,
	"#sound_seteffectto",			"将 &2 音效设为 %1",			0,
	"#sound_cleareffects",			"清除音效",				0,
	"#sound_changevolumeby",		"将音量增加 %1",			0,
	"#sound_setvolumeto",			"将音量设为 %1 ^%",			0,
	"#sound_volume",			"(音量)",				99,

	"&sound_changeeffectby:PITCH",		"音调",
	"&sound_seteffectto:PITCH",		"音调",
	"&sound_changeeffectby:PAN",		"左右平衡",
	"&sound_seteffectto:PAN",		"左右平衡",

	//事件
	"#event_whenflagclicked",		"当 绿旗 被点击",			0,
	"#event_whenkeypressed",		"当按下 &1 键",				0,
	"#event_whenstageclicked",		"当舞台被点击",				0,
	"#event_whenthisspriteclicked",		"当角色被点击",				0,
	"#event_whenbackdropswitchesto",	"当背景换成 %1",			0,
	"#event_whengreaterthan",		"当 &2 > %1",				0,
	"#event_whenbroadcastreceived",		"当接收到 %1",				0,
	"#event_broadcast",			"广播 %1",				0,
	"#event_broadcastandwait",		"广播 %1 并等待",			0,

	"&event_whenkeypressed:space",		"空格",
	"&event_whenkeypressed:any",		"任意",
	"&event_whenkeypressed:up arrow",	"↑",
	"&event_whenkeypressed:down arrow",	"↓",
	"&event_whenkeypressed:right arrow",	"→",
	"&event_whenkeypressed:left arrow",	"←",
	"&event_whengreaterthan:LOUDNESS",	"响度",
	"&event_whengreaterthan:TIMER",		"计时器",

	//控制
	"#control_wait",			"等待 %1 秒",				0,
	"#control_repeat",			"重复执行 %1 次 @2",			0,
	"#control_forever",			"重复执行 @1",				0,
	"#control_if",				"如果 %1 那么 @2",			0,
	"#control_if_else",			"如果 %1 那么 @2 否则 @3",		0,
	"#control_wait_until",			"等待 @1",				0,
	"#control_repeat_until",		"重复执行直到 %1 @2",			0,
	"#control_while",			"当 %1 重复执行 @2",			0,
	"#control_for_each",			"对于 %1 中的每一个 %2 @3",		0,
	"#control_stop",			"停止 &1",				0,
	"#control_start_as_clone",		"当作为克隆体启动时",			0,
	"#control_create_clone_of",		"克隆 %1",				0,
	"#control_create_clone_of_menu",	"($1)",					0,
	"#control_delete_this_clone",		"删除此克隆体",				0,

	"&control_stop:all",			"全部脚本",
	"&control_stop:other scripts in sprite","该角色的其他脚本",
	"&control_stop:this script",		"这个脚本",

	//侦测
	"#sensing_touchingobject",		"碰到 %1",				0,
	"#sensing_touchingobjectmenu",		"($1)",					99,
	"#sensing_touchingcolor",		"碰到颜色 %1",				0,
	"#sensing_coloristouchingcolor",	"颜色 %1 碰到 %1",			0,
	"#sensing_distanceto",			"到 %1 的距离",				0,
	"#sensing_distancetomenu",		"($1)",					99,
	"#sensing_askandwait",			"询问 %1 并等待",			0,
	"#sensing_answer",			"(回答)",				99,
	"#sensing_keypressed",			"<按下 %1 键>",				99,
	"#sensing_keyoptions",			"&1",					0,
	"#sensing_mousedown",			"<按下鼠标?>",				99,
	"#sensing_mousex",			"(鼠标的x坐标)",			99,
	"#sensing_mousey",			"(鼠标的y坐标)",			99,
	"#sensing_setdragmode",			"将拖动模式设为 &1",			0,
	"#sensing_loudness",			"(响度)",				99,
	"#sensing_timer",			"(计时器)",				99,
	"#sensing_resettimer",			"计时器归零",				0,
	"#sensing_of",				"(%1 的 %2)",				99,
	"#sensing_of_object_menu",		"($1)",					99,
	"#sensing_current",			"(当前时间的 &1)",			99,
	"#sensing_dayssince2000",		"2000年至今的天数",			0,
	"#sensing_username",			"(用户名)",				99,

	"&sensing_keyoptions:space",		"空格",
	"&sensing_keyoptions:any",		"任意",
	"&sensing_keyoptions:up arrow",		"↑",
	"&sensing_keyoptions:down arrow",	"↓",
	"&sensing_keyoptions:right arrow",	"→",
	"&sensing_keyoptions:left arrow",	"←",
	"&sensing_setdragmode:draggable",	"可拖动",
	"&sensing_setdragmode:not draggable",	"不可拖动",
	"&sensing_current:YEAR",		"年",
	"&sensing_current:MONTH",		"月",
	"&sensing_current:DATE",		"日",
	"&sensing_current:DAYOFWEEK",		"星期",
	"&sensing_current:HOUR",		"小时",
	"&sensing_current:MINUTE",		"分钟",
	"&sensing_current:SECOND",		"秒",

	//运算
	"#operator_add",			"(%1 + %2)",				-5,
	"#operator_subtract",			"(%1 - %2)",				5,
	"#operator_multiply",			"(%1 × %2)",				-6,
	"#operator_divide",			"(%1 ÷ %2)",				6,
	"#operator_random",			"(在 %1 和 %2 之间取随机数)",		99,
	"#operator_gt",				"<%1 > %2>",				4,
	"#operator_lt",				"<%1 < %2>",				4,
	"#operator_equals",			"<%1 = %2>",				4,
	"#operator_and",			"<%1 与 %2>",				-3,
	"#operator_or",				"<%1 或 %2>",				-2,
	"#operator_not",			"<%1 不成立>",				-1,
	"#operator_join",			"(连接 %1 和 %2)",			99,
	"#operator_letter_of",			"(%1 的第 %2 个字符)",			99,
	"#operator_length",			"(%1 的长度)",				99,
	"#operator_contains",			"<%1 包含 %2 ?>",			99,
	"#operator_mod",			"(%1 除以 %2 的余数)",			99,
	"#operator_round",			"(四舍五入 %1)",			99,
	"#operator_mathop",			"&2(%1)",				99,

	"&operator_mathop:abs",			"绝对值",
	"&operator_mathop:floor",		"向下取整",
	"&operator_mathop:ceiling",		"向上取整",
	"&operator_mathop:sqrt",		"平方根",

	//变量
	"#data_setvariableto",			"将 %2 设为 %1",			0,
	"#data_changevariableby",		"将 %2 增加 %1",			0,
	"#data_showvariable",			"显示变量 %1",				0,
	"#data_hidevariable",			"隐藏变量 %1",				0,
	"#data_addtolist",			"将 %1 加入 %2",			0,
	"#data_deleteoflist",			"删除 %2 的第 %1 项",			0,
	"#data_deletealloflist",		"删除 %1 的全部项目",			0,
	"#data_insertatlist",			"在 %3 的第 %1 项前插入 %2",		0,
	"#data_replaceitemoflist",		"将 %3 的第 %1 项替换为 %2",		0,
	"#data_showlist",			"显示列表 %1",				0,
	"#data_hidelist",			"隐藏列表 %1",				0,
	"#data_itemoflist",			"(%2 的第 %1 项)",			99,
	"#data_itemnumoflist",			"(%2 的第一个 %1 的编号",		99,
	"#data_lengthoflist",			"(%1 的项目数)",			99,
	"#data_listcontainsitem",		"<%1 包含 %2 ?>",			99,

	// 自定义积木
	"#procedures_definition",		"定义 ",				0,
	"#procedures_call",			"调用 ",				0,

	//角色翻译
	"$_random_",				"随机位置",
	"$_mouse_",				"鼠标指针",
	"$_myself_",				"自己",
	"$_stage_",				"舞台",
	"$_edge_",				"舞台边缘",

	/*}}}*/

	// Scratch拓展积木(无硬件相关积木)
	/*{{{*/

	//音乐
	"#music_playDrumForBeats",		"击打 %1 %2 拍",			99,
	"#music_menu_DRUM",			"(&1)",					0,
	"#music_restForBeats",			"休止 %1 拍",				99,
	"#music_playNoteForBeats",		"演奏音符 %1 拍",			99,
	"#note",				"(%1)",					0,
	"#music_setInstrument",			"将乐器设为 %1",			99,
	"#music_menu_INSTRUMENT",		"(&1)",					0,
	"#music_setTempo",			"将演奏速度设定为 %1",			99,
	"#music_changeTempo",			"将演奏速度增加 %1",			99,
	"#music_getTempo",			"(演奏速度)",				0,

	"&music_menu_DRUM:1",			"(1) 小军鼓",
	"&music_menu_DRUM:2",			"(2) 低音鼓",
	"&music_menu_DRUM:3",			"(3) 敲鼓边",
	"&music_menu_DRUM:4",			"(4) 碎音钹",
	"&music_menu_DRUM:5",			"(5) 开击踩镲",
	"&music_menu_DRUM:6",			"(6) 闭击踩镲",
	"&music_menu_DRUM:7",			"(7) 铃鼓",
	"&music_menu_DRUM:8",			"(8) 手掌",
	"&music_menu_DRUM:9",			"(9) 音棒",
	"&music_menu_DRUM:10",			"(10) 木鱼",
	"&music_menu_DRUM:11",			"(11) 牛铃",
	"&music_menu_DRUM:12",			"(12) 三角铁",
	"&music_menu_DRUM:13",			"(13) 邦戈鼓",
	"&music_menu_DRUM:14",			"(14) 康加鼓",
	"&music_menu_DRUM:15",			"(15) 卡巴萨",
	"&music_menu_DRUM:16",			"(16) 刮瓜",
	"&music_menu_DRUM:17",			"(17) 颤音器",
	"&music_menu_DRUM:18",			"(18) 锯加鼓",
	"&music_menu_INSTRUMENT:1",		"(1) 钢琴",
	"&music_menu_INSTRUMENT:2",		"(2) 电钢琴",
	"&music_menu_INSTRUMENT:3",		"(3) 风琴",
	"&music_menu_INSTRUMENT:4",		"(4) 吉他",
	"&music_menu_INSTRUMENT:5",		"(5) 电吉他",
	"&music_menu_INSTRUMENT:6",		"(6) 贝斯",
	"&music_menu_INSTRUMENT:7",		"(7) 拨弦",
	"&music_menu_INSTRUMENT:8",		"(8) 大提琴",
	"&music_menu_INSTRUMENT:9",		"(9) 长号",
	"&music_menu_INSTRUMENT:10",		"(10) 单簧管",
	"&music_menu_INSTRUMENT:11",		"(11) 萨克斯管",
	"&music_menu_INSTRUMENT:12",		"(12) 长笛",
	"&music_menu_INSTRUMENT:13",		"(13) 木长笛",
	"&music_menu_INSTRUMENT:14",		"(14) 巴松管",
	"&music_menu_INSTRUMENT:15",		"(15) 唱诗班",
	"&music_menu_INSTRUMENT:16",		"(16) 颤音琴",
	"&music_menu_INSTRUMENT:17",		"(17) 八音盒",
	"&music_menu_INSTRUMENT:18",		"(18) 钢鼓",
	"&music_menu_INSTRUMENT:19",		"(19) 马林巴琴",
	"&music_menu_INSTRUMENT:20",		"(20) 合成主音",
	"&music_menu_INSTRUMENT:21",		"(21) 合成柔音",

	//画笔
	"#pen_clear",				"全部擦除",
	"#pen_stamp",				"图章",
	"#pen_penDown",				"落笔",
	"#pen_penUp",				"抬笔",
	"#pen_setPenColorToColor",		"将笔的颜色设为 %1",
	"#pen_changePenColorParamBy",		"将笔的 %1 增加 %2",
	"#pen_menu_colorParam",			"(&1)",
	"#pen_setPenColorParamTo",		"将笔的 %1 设为 %2",
	"#pen_changePenSizeBy",			"将笔的粗细增加 %1",
	"#pen_setPenSizeTo",			"将笔的粗细设为 %1",

	"&pen_menu_colorParam:color",		"颜色",
	"&pen_menu_colorParam:saturation",	"饱和度",
	"&pen_menu_colorParam:brightness",	"亮度",
	"&pen_menu_colorParam:transparency",	"透明度",

	//视频侦测
	"#videoSensing_whenMotionGreaterThan",	"当视频运动 > %1",			0,
	"#videoSensing_videoToggle",		"%1 摄像头",				0,
	"#videoSensing_menu_VIDEO_STATE",	"(&1)",					99,
	"#videoSensing_setVideoTransparency",	"将视频透明度设为 %1",			0,
	"#videoSensing_videoOn",		"(&1)",					99,
	"#videoSensing_menu_SUBJECT",		"(&1)",					99,
	"#videoSensing_menu_ATTRIBUTE",		"(&1)",					99,

	"&videoSensing_menu_VIDEO_STATE:off",	"关闭",
	"&videoSensing_menu_SUBJECT:this sprite","角色",

	//文字朗读
	"#text2speech_speakAndWait",		"朗读 %1",				0,
	"#text2speech_setVoice",		"使用 %1 嗓音",				0,
	"#text2speech_menu_voices",		"(&1)",					99,
	"#text2speech_setLanguage",		"将朗读语言设置为 %1",			0,
	"#text2speech_menu_languages",		"(&1)",					99,

	"&text2speech_menu_voices:ALTO",	"中音",
	"&text2speech_menu_voices:TENOR",	"男高音",
	"&text2speech_menu_voices:SQUEAK",	"尖细",
	"&text2speech_menu_voices:GIANT",	"巨人",
	"&text2speech_menu_voices:KITTEN",	"小猫",
	"&text2speech_menu_languages:zh-cn",	"中文",
	"&text2speech_menu_languages:ar",	"阿拉伯语",
	"&text2speech_menu_languages:da",	"丹麦语",
	"&text2speech_menu_languages:nl",	"荷兰语",
	"&text2speech_menu_languages:en",	"英语",
	"&text2speech_menu_languages:fr",	"法语",
	"&text2speech_menu_languages:de",	"德语",
	"&text2speech_menu_languages:hi",	"印地语",
	"&text2speech_menu_languages:is",	"冰岛语",
	"&text2speech_menu_languages:it",	"意大利语",
	"&text2speech_menu_languages:ja",	"日语",
	"&text2speech_menu_languages:ko",	"韩语",
	"&text2speech_menu_languages:nb",	"挪威语",
	"&text2speech_menu_languages:pl",	"波兰语",
	"&text2speech_menu_languages:pt-br",	"葡萄牙语（巴西）",
	"&text2speech_menu_languages:pt",	"葡萄牙语",
	"&text2speech_menu_languages:ro",	"罗马尼亚语",
	"&text2speech_menu_languages:ru",	"俄语",
	"&text2speech_menu_languages:es",	"西班牙语",
	"&text2speech_menu_languages:es-419",	"西班牙语（拉丁美洲）",
	"&text2speech_menu_languages:sv",	"瑞典语",
	"&text2speech_menu_languages:tr",	"土耳其语",
	"&text2speech_menu_languages:cy",	"威尔士语",

	//翻译
	"#translate_getTranslate",		"(将 %1 译为 %2)",			99,
	"#translate_menu_languages",		"(&1)",					99,
	"#translate_getViewerLanguage",		"(访客语言)",				99,

	// 注意！这里的语言不完整
	"&translate_menu_languages:zh-cn",	"中文",
	"&translate_menu_languages:ar",		"阿拉伯语",
	"&translate_menu_languages:da",		"丹麦语",
	"&translate_menu_languages:nl",		"荷兰语",
	"&translate_menu_languages:en",		"英语",
	"&translate_menu_languages:fr",		"法语",
	"&translate_menu_languages:de",		"德语",
	"&translate_menu_languages:hi",		"印地语",
	"&translate_menu_languages:is",		"冰岛语",
	"&translate_menu_languages:it",		"意大利语",
	"&translate_menu_languages:ja",		"日语",
	"&translate_menu_languages:ko",		"韩语",
	"&translate_menu_languages:nb",		"挪威语",
	"&translate_menu_languages:pl",		"波兰语",
	"&translate_menu_languages:pt-br",	"葡萄牙语（巴西）",
	"&translate_menu_languages:pt",		"葡萄牙语",
	"&translate_menu_languages:ro",		"罗马尼亚语",
	"&translate_menu_languages:ru",		"俄语",
	"&translate_menu_languages:es",		"西班牙语",
	"&translate_menu_languages:es-419",	"西班牙语（拉丁美洲）",
	"&translate_menu_languages:sv",		"瑞典语",
	"&translate_menu_languages:tr",		"土耳其语",
	"&translate_menu_languages:cy",		"威尔士语",

	//Makey Makey
	"#makeymakey_whenMakeyKeyPressed",	"当按下 %1 键",				0,
	"#makeymakey_menu_KEY",			"(&1)",					99,
	"#makeymakey_whenCodePressed",		"当依次按下 %1 键时",			0,
	"#makeymakey_menu_SEQUENCE",		"(&1)",					99,

	"&makeymakey_menu_KEY:SPACE",		"空格",
	"&makeymakey_menu_SEQUENCE:LEFT UP RIGHT","左 上 右",
	"&makeymakey_menu_KEY:UP",		"上",
	"&makeymakey_menu_KEY:DOWN",		"下",
	"&makeymakey_menu_KEY:RIGHT",		"右",
	"&makeymakey_menu_KEY:LEFT",		"左",
	"&makeymakey_menu_SEQUENCE:RIGHT UP LEFT","右 上 左",
	"&makeymakey_menu_SEQUENCE:LEFT RIGHT",	"左 右",
	"&makeymakey_menu_SEQUENCE:RIGHT LEFT",	"右 左",
	"&makeymakey_menu_SEQUENCE:UP DOWN",	"上 下",
	"&makeymakey_menu_SEQUENCE:DOWN UP",	"下 上",
	"&makeymakey_menu_SEQUENCE:UP RIGHT DOWN LEFT","上 右 下 左",
	"&makeymakey_menu_SEQUENCE:UP LEFT DOWN RIGHT","上 左 下 右",
	"&makeymakey_menu_SEQUENCE:UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT","上 上 下 下 左 右 左 右",

	/*}}}*/

	//TurboWarp
	/*{{{*/
	"#tw_getLastKeyPressed",		"(last key pressed)",			99,
	"#tw_getButtonIsDown",			"<%1 mouse button down?>",		99,
	"#tw_menu_mouseButton",			"(&1)",					99,

	"&tw_menu_mouseButton:0",		"(0) primary",
	"&tw_menu_mouseButton:1",		"(1) middle",
	"&tw_menu_mouseButton:2",		"(2) secondary",
	/*}}}*/

	//稽木世界
	/*{{{*/

	//LazyAudio
	"#lazyAudio_load",			"load(%1)",				0,
	"#lazyAudio_playAndWait",		"playAndWait(%1)",			0,

	//Canvas
	"#canvas_beginPath",			"beginPath",				0,
	"#canvas_closePath",			"closePath",				0,
	"#canvas_moveTo",			"moveTo(%1,%2)",			0,
	"#canvas_lineTo",			"lineTo(%1,%2)",			0,
	"#canvas_arc",				"arc(%1,%2,%3,%4,%5)",			0,
	"#canvas_rect",				"rect(%1,%2,%3,%4)",			0,
	"#canvas_clip",				"clip",					0,
	"#canvas_setLineWidth",			"setLineWidth(%1)",			0,
	"#canvas_setLineCap",			"setLineCap(%1)",			0,
	"#canvas_setStrokeStyle",		"setStrokeStyle(%1)",			0,
	"#canvas_setFillStyle",			"setFillStyle(%1)",			0,
	"#canvas_stroke",			"stroke",				0,
	"#canvas_fill",				"fill",					0,
	"#canvas_clearRect",			"clearRect(%1,%2,%3,%4)",		0,
	"#canvas_setFont",			"setFont(%1)",				0,
	"#canvas_strokeText",			"strokeText(%1,%2,%3)",			0,
	"#canvas_fillText",			"fillText(%1,%2,%3)",			0,
	"#canvas_loadImage",			"loadImage(%1)",			0,
	"#canvas_drawImage",			"drawImage(%1,%2,%3)",			0,
	"#canvas_scale",			"scale(%1,%2)",				0,
	"#canvas_rotate",			"rotate(%1)",				0,
	"#canvas_translate",			"translate(%1,%2)",			0,
	"#canvas_transform",			"transform(%1,%2,%3,%4,%5,%6)",		0,
	"#canvas_clearTransform",		"clearTransform",			0,
	"#canvas_save",				"save",					0,
	"#canvas_restore",			"restore",				0,
	"#canvas_setGlobalAlpha",		"setGlobalAlpha(%1)",			0,
	"#canvas_setGlobalCompositeOperation",	"setGlobalCompositeOperation(%1)",	0,
	"#canvas_switchCanvas",			"switchCanvas(%1)",			0,
	"#canvas_stampOnStage",			"stampOnStage",				0,
	"#canvas_measureText",			"(measureText(%1))",			99,

	//String Extension
	"#stringExt_charCodeAt",		"(%1 的第 %2 个字符的编码)",		99,
	"#stringExt_fromCharCode",		"(编码 %1 对应的字符)",			99,
	"#stringExt_serializeToJson",		"(将 %1 开头的变量转换为JSON)",		99,
	"#stringExt_deserializeFromJson",	"(将 %1 开头的变量设为JSON %2)",	99,
	"#stringExt_postJson",			"发送JSON %1",				0,
	"#stringExt_menu_urlNames",		"(&1)",					99,
	"#stringExt_postResponse",		"(发送JSON应答)",			99,

	"&stringExt_menu_urlNames:cloudSpace",	"云空间",				0,

	//JavaScript
	"#js_serializeToJson",			"(将 %1 开头的变量转换为JSON)",		99,
	"#js_deserializeFromJson",		"(将 %1 开头的变量设为JSON %2)",	99,
	"#js_postJson",				"发送JSON %1 到 %2",			0,
	"#js_menu_urlNames",			"(&1)",					99,
	"#js_postResponse",			"(发送JSON应答)",			99,
	"#js_callWorker",			"(callWorker(%1,%2))",			99,

	"&js_menu_urlNames:cloudSpace",		"云空间",				0,

	//Community
	"#community_getUserInfo",		"(%1)",					99,
	"#community_isFollower",		"<is folloewr?>",			99,
	"#community_isProjectLover",		"<love this project?>",			99,
	"#community_openUrl",			"open %1",				0,
	"#community_redirectUrl",		"redirect %1",				0,
	"#community_pay",			"pay %1 for %2",			0,
	"#community_getError",			"(error)",				99,

	//Puzzle
	"#puzzle_convertPaintToWatermark",	"将画板保存为水印",			0,
	"#puzzle_showWatermark",		"显示水印",				0,
	"#puzzle_hideWatermark",		"隐藏水印",				0,
	"#puzzle_isPaintSameAsWatermark",	"<画板与水印是否相同>",			99,
	"#puzzle_attemptCount",			"(重置次数)",				99,
	"#puzzle_stepInterval",			"(动作间隔)",				99,
	"#puzzle_setResolved",			"将任务设定为已完成 %1",		0,
	"#puzzle_setSpriteTracker",		"设置角色追踪器 %1",			0,

	//Kinect
	"#kinect_getSensorOfPlayer",		"(%1 of %2)",				99,
	"#kinect_menu_SENSOR",			"(%1)",					99,
	"#kinect_menu_PLAYER",			"(%1)",					99,

	/*}}}*/

	//共创世界
	/*{{{*/

	//社区(注意和稽木世界的不一样)
	"#community_isMyFans",			"<粉丝?>",				99,
	"#community_isLiked",			"<已点赞?>",				99,
	"#community_redirect",			"跳转到 https://x.xiguacity.cn/ %1",	0,
	"#community_captureStageAsAvatar",	"从舞台截取头像",			0,

	//音乐懒加载
	"#lazyMusic_loadMusic",			"加载 %1",				0,
	"#lazyMusic_playMusicFromSeconds",	"从 %1 秒开始播放 %2 . &3",		0,
	"#lazyMusic_setMusicPlayRate",		"设置 %1 的播放速度为 %2 ^%",		0,
	"#lazyMusic_stopPlayMusic",		"停止播放 %1",				0,

	"&lazyMusic_playMusicFromSeconds:wait",	"并等待",
	"&lazyMusic_playMusicFromSeconds:doNotWait","不等待",

	//艺术字
	"#text_setText",			"显示文字 %1",				0,
	"#text_animateText",			"&2 效果显示文字 %1",			0,
	"#text_clearText",			"显示角色",				0,
	"#text_setFont",			"将字体设置为 &1",			0,
	"#text_setColor",			"将文字颜色设置为 %1",			0,
	"#text_setWidth",			"将宽度设置为 %1 对齐方式为 &2",	0,

	"&text_animateText:rainbow",		"彩虹",
	"&text_animateText:type",		"打字机",
	"&text_animateText:zoom",		"放大",
	"&text_setFont:fzdlt",			"方正达利体",
	"&text_setFont:fzyzt",			"方正雅珠体",
	"&text_setFont:iPix",			"iPix（像素字体）",
	"&text_setFont:cexwz",			"仓耳小丸体",
	"&text_setFont:qtxtt",			"千图小兔体",
	"&text_setFont:Sans Serif",		"Sans Serif",
	"&text_setFont:Serif",			"Serif",
	"&text_setFont:Handwriting",		"Handwriting",
	"&text_setFont:Marker",			"Marker",
	"&text_setFont:Curly",			"Curly",
	"&text_setFont:Pixel",			"Pixel",
	"&text_setFont:Random",			"随机字体",
	"&text_setWidth:left",			"靠左对齐",
	"&text_setWidth:center",		"中心对齐",
	"&text_setWidth:right",			"靠右对齐",

	//面部识别
	"#faceSensing_goToPart",		"移动到 &1",				0,
	"#faceSensing_pointInFaceTiltDirection","面向面部的方向",			0,
	"#faceSensing_setSizeToFaceSize",	"将大小设置为面部的大小",		0,
	"#faceSensing_whenTilted",		"当面部倾斜向 &1",			0,
	"#faceSensing_whenSpriteTouchesPart",	"当角色碰到 &1",			0,
	"#faceSensing_whenFaceDetected",	"当检测到面部",				0,
	"#faceSensing_faceIsDetected",		"<检测到面部?>",			99,
	"#faceSensing_faceTilt",		"(面部倾斜方向)",			99,
	"#faceSensing_faceSize",		"(面部大小)",				99,

	"&faceSensing_goToPart:2",		"鼻子",
	"&faceSensing_goToPart:3",		"嘴",
	"&faceSensing_goToPart:0",		"左眼",
	"&faceSensing_goToPart:1",		"右眼",
	"&faceSensing_goToPart:6",		"两眼之间",
	"&faceSensing_goToPart:4",		"左耳",
	"&faceSensing_goToPart:5",		"右耳",
	"&faceSensing_goToPart:7",		"头顶",
	"&faceSensing_whenTilted:left",		"左边",
	"&faceSensing_whenTilted:right",	"右边",
	"&faceSensing_whenSpriteTouchesPart:2",	"鼻子",
	"&faceSensing_whenSpriteTouchesPart:3",	"嘴",
	"&faceSensing_whenSpriteTouchesPart:0",	"左眼",
	"&faceSensing_whenSpriteTouchesPart:1",	"右眼",
	"&faceSensing_whenSpriteTouchesPart:6",	"两眼之间",
	"&faceSensing_whenSpriteTouchesPart:4",	"左耳",
	"&faceSensing_whenSpriteTouchesPart:5",	"右耳",
	"&faceSensing_whenSpriteTouchesPart:7",	"头顶",

	//物理引擎(这里有必要提到的是，这个引擎来自griffpatch，网站里没给credit。你可以在codelab.club里发现证据。)
	"#box2d_setStage",			"把空间设置为 &1",			0,
	"#box2d_setGravity",			"把重力设置为 x: %1 y: %2",		0,
	"#box2d_setPhysics",			"为 &1 开启 &2",			0,
	"#box2d_doTick",			"分布模拟",				0,
	"#box2d_setPosition",			"移动到 x: %1 y: %2 &3",		0,
	"#box2d_setVelocity",			"将速度设为 sx: %1 sy: %2",		0,
	"#box2d_changeVelocity",		"将速度增加 sx: %1 sy: %2",		0,
	"#box2d_getVelocityX",			"(x速度)",				99,
	"#box2d_getVelocityY",			"(y速度)",				99,
	"#box2d_applyForce",			"用大小为 %1 方向为 %2 的力推角色",	0,
	"#box2d_applyAngForce",			"用大小为 %1 的力转动角色",		0,
	"#box2d_setStatic",			"将角色设定为 &1",			0,
	"#box2d_setProperties",			"设置角色的密度 &1 粗糙度 &2 弹性 &3",	0,
	//由于设计缺陷，‘设置角色的密度’的积木的选项翻译不了
	"#box2d_getTouching",			"(触碰到角色的 &1)",			99,
	"#box2d_setScroll",			"将舞台区滚动设为 x: %1 y: %2",		0,
	"#box2d_changeScroll",			"将舞台区滚动增加 x: %1 y: %2",		0,
	"#box2d_getScrollX",			"(舞台区滚动x)",			99,
	"#box2d_getScrollY",			"(舞台区滚动y)",			99,

	"&box2d_setStage:boxed",		"舞台区内",
	"&box2d_setStage:floor",		"开放舞台区（有地面）",
	"&box2d_setStage:open",			"开放舞台区（无地面）",
	"&box2d_setPhysics:costume",		"造型区域范围",
	"&box2d_setPhysics:circle",		"圆形区域范围",
	"&box2d_setPhysics:svg",		"多边形区域范围",
	"&box2d_setPhysics:all",		"所有角色",
	"&box2d_setPhysics:normal",		"普通",
	"&box2d_setPhysics:bullet",		"精确",
	"&box2d_setPosition:world",		"在空间中",
	"&box2d_setPosition:stage",		"在舞台区中",
	"&box2d_setPosition:relative",		"相对位置",
	"&box2d_setStatic:static",		"固定的",
	"&box2d_setStatic:dynamic",		"自由的",
	"&box2d_setStatic:pinned",		"固定的（可以旋转）",
	"&box2d_getTouching:any",		"任何位置",
	"&box2d_getTouching:feet",		"底部",

	//小红板
	"#redBoard_magicNumber",		"(魔法数值)",				99,

	/*}}}*/
];
