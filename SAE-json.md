怎么使用
========

`SAE.json.load` 载入json文本，返回作品的编号  

`SAE.json.debug(编号)`  
输出编号为起点的结构树  

`SAE.options._OrigInputType`  
显示输入区的编号，仅供调试使用，会显示输入的数字类型，但同时会导致分析出错。（查找 InputType 了解更多）

Scratch JSON 文件的构成
=======================

Scratch 的 JSON 文件最外层是一个对象，有四个属性：

`{"targets":[...],"monitors":[...],"extensions":[...],"meta":{...}}`

| 名字       | 说明                 |
| ---------- | -------------------- |
| targets    | 背景和角色           |
| monitors   | 变量在舞台上的显示   |
| extensions | 使用的拓展           |
| meta       | 创作作品的工具的说明 |

targets
-------

targets是一个包含了n个对象的数组。
`"targets":[{...},{...},...]`

每一个对象的属性：

(!:只有舞台才有 !!:只有角色才有 ?:后面有详细说明)

| 名字                 | 说明                                              |
| -------------------- | ------------------------------------------------- |
| isStage              |    是否为舞台                                     |
| name                 |    角色名字（舞台为`Stage`）                      |
| variables            |   ?变量列表（如果是舞台，则为共用变量）           |
| lists                |   ?列表列表（如果是舞台，则为共用列表）           |
| broadcasts           |   ?广播列表                                       |
| blocks               |   ?积木列表                                       |
| comments             |   ?注释列表                                       |
| currentCostume       |    当前造型编号（0开始）                          |
| costumes             |   ?造型列表                                       |
| sounds               |   ?声音列表                                       |
| volume               |    当前音量（舞台，角色都有！）                   |
| layerOrder           | !  层叠顺序（越小越后）                           |
| tempo                | !  演奏拍子数（拓展：音乐）                       |
| videoState           | !  摄像头是否开启（拓展：视频侦测）               |
| textToSpeechLanguage | !  文本转语音语言（拓展：文本朗读）               |
| visible              | !  是否显示                                       |
| x                    | !! x坐标                                          |
| y                    | !! y坐标                                          |
| size                 | !! 大小                                           |
| direction            | !! 方向                                           |
| draggable            | !! 可拖动？                                       |
| rotationStyle        | !! 旋转模式                                       |

variables,lists
---------------

变量列表为一个对象，表示角色、舞台里的变量。

`"variables":{"变量id":["变量名","数值"],...}`

变量id - 系统自动生成的变量id，一般是20个字符。__也有例外，例如“我的变量”__  
变量名：变量的名字  
数值：变量的数值  
列表同理，只是数值变成了列表。

broadcasts
----------

`"broadcasts":{"广播id":"广播名",...}`

广播列表的结构和变量差不多，就是没有数值的变量。表示角色、舞台内使用的广播。  
这个列表目前在处理时没有任何用处。因为处理时直接读取积木。

costumes,sounds
---------------

costumes和sounds是一个包含了n个对象的数组。
`"costumes":[{...},{...},...]`
`"sounds":[{...},{...},...]`

每一个对象的属性：

(!:只有costumes才有 !!:只有sound才有)

| 名字             | 说明                                              |
| ---------------- | ------------------------------------------------- |
| name             |    造型/声音的名字                                |
| assetId          |    造型/声音的包内文件名（一般是文件md5+原拓展名）|
| md5ext           |    和assetId一样                                  |
| dataFormat       |    文件拓展名                                     |
| bitmapResolution | !  位图分辨率（表示图像会被缩小到几分之一）       |
| rotationCenterX  | !  图片旋转中心x坐标                              |
| rotationCenterY  | !  图片旋转中心y坐标                              |
| format           | !! __不知道!__                                    |
| sampleCount      | !! 声音采样数                                     |
| rate             | !! 声音采样率 (sample/rate=声音长度(秒)           |

comments
--------

comments是一个包含了很多`注释对象`的对象。

`"comments":{"注释id":{...},...}`

每一个注释对象的属性：

| 名字      | 说明                                         |
| --------- | -------------------------------------------- |
| blockId   | 注释连接到的积木id(null:没链接到积木的注释)  |
| x         | x坐标                                        |
| y         | y坐标                                        |
| width     | 宽度                                         |
| height    | 高度                                         |
| minimized | 注释是否折叠                                 |
| text      | 注释文本                                     |

blocks
------

blocks是一个包含了很多`积木对象`的对象。

`"blocks":{"积木id":{...},...}`

积木对象的格式比较复杂。? 表示后面会详细说明

| 名字      | 说明                                                       |
| --------- | ---------------------------------------------------------- |
| opcode    | ?积木的类型（例如`motion_gotoxy`代表`移动到 x: () y: ()`） |
| next      |  下一个积木的id（null表示没有）                            |
| parent    |  上一个（或者，外面一层的）积木的id（null表示没有）        |
| inputs    | ?输入的数字和放入的积木                                    |
| fields    | ?选择的下拉选项                                            |
| shadow    |  是否为可拖出的积木（例如造型选项即为不可拖出的积木）      |
| toplevel  |  是否处于最前面(parent等于null)                            |
| x         |  x坐标（只在最前面的积木出现）                             |
| y         |  y坐标（只在最前面的积木出现）                             |
| mutation  | ?积木变体信息                                              |

需要注意的是还有一种特殊情况，在有变量和列表单独出现（没有连在其他积木上）时，  
"积木id"后还可能会出现数组[...]，需要特别留意，其格式如下：

`[输入类型,数值,相关id,x坐标,y坐标]`

可以参见 __inputs__ 中的说明。

__opcode__

opcode是表示积木的类型，一般由`类型名_操作名`组成。  
例如 `motion_gotoxy` 就表示 `motion`(运动) 类型下的 `gotoxy` 动作。`移动到 x: () y: ()`  
可以在 SAE-disp-table.js 中找到积木类型与积木显示之间的对照表。
关于类型与拓展列表，可以参考 extensions.

__inputs__

`"inputs":{"输入名1":[...],"输入名2":[...],...}`

输入名:代表参数的名字，例如在积木`motion_movesteps`中`STEPS`表示步数

SAE 没有检测参数的名字，而是假设它们以一定的顺序出现，因此在SAE-disp-table.js中参数都用1,2,3...编号。这并不严谨。  
不过也有例外，在"如果","不成立"这类要拖入六边形积木和其它积木组的时候参数将会按照拖入的顺序进行排序，如果没有拖入还会消失。  
这时就需要通过检测输入名的最后一个字符(偷懒)来判断参数的位置。  
例如"如果"`control_if`中有两个参数:`CONDITION`和`SUBSTACK`，那么就把它在特殊(需要特殊关照的)积木列表`blockspecs`中标记  
`"#control_if",		"NK",`  
就表示 `control_if` 中有两个参数，最后一个字母分别是`N`和`K`。

然后是[...]里的内容，是这样：

`[类型编号,参数1]` 或者 `[类型编号,参数1,参数2]`

注意参数1，参数2中既可能有文本或者数字，也可能有与`[类型编号,参数1,参数2]`相似的结构，例如

`[1, [12, "x", "XzZ3_=u+7z5o#CUVg4,_"], "10"]`

像这种参数中也有 `[类型编号,参数1,参数2]` 类型编号的情况，在下面的表格中会用[类型x]来代替

我总结了一下大概是这样：

| 编号 | 参数1               | 参数2               | 说明                                                                            |
| ---- | ------------------- | ------------------- | ------------------------------------------------------------------------------- |
| 1    | [积木id] 或 [类型x] | 无                  |  普通的白色空或者圆形选项，内容是参数1的数值                                    |
| 2    | [积木id] 或 null    | 无                  |  六边形填入或者C,E形积木中的积木组的填入，参数1表示填入的积木id(null表示未填入) |
| 3    | [积木id] 或 [类型x] | [积木id] 或 [类型x] |  填入积木的白色空或者圆形选项，参数1为填入的积木，参数2为原来的白色空或者选项   |
| 4    | 数字                | 无                  | !能填入任意数字的白色空                                                         |
| 5    | 大于零的数字        | 无                  | !能填入任意大于零的数字的白色空                                                 |
| 6    | 正整数              | 无                  | !能填入任意正整数的白色空                                                       |
| 7    | 正整数              | 无                  | !能填入任意正整数的白色空（列表序号专用）                                       |
| 8    | 表示角度的数字      | 无                  |  能填入表示角度的数字的白色空（大于-180，不超过180）                            |
| 9    | 颜色                | 无                  |  能选择颜色的空                                                                 |
| 10   | 文本                | 无                  |  能填入任意文本的白色空                                                         |
| 11   | 广播名字            | 无                  |  能选择广播名字的选项                                                           |
| 12   | 变量名              | [变量id]            |  引用变量                                                                       |
| 13   | 列表名              | [列表id]            |  引用列表                                                                       |

标了 ! 的积木在电脑上这些没啥区别，你可以想输入什么数字就输入什么数字，但是在手机上点击这些空会弹出有限按钮的输入小键盘，会有区别。  
例如整数输入时没有.号，正整数输入时没有-号

__fields__

fields比较简单。

`"fields":{"输入名1":[...],"输入名2":[...],...}`

输入名和 __inputs__ 差不多。除了没有特殊情况之外。

[...]的语法也变简单了，具体是 `["文本",指向id]`, 其中指向id 表示文本指向的项目id  
(如果文本是变量名，那么id就是相对应的变量id；如果文本是广播名，那么指向id 表示文本指向的广播id；如果没有合适的id则会显示null。  

__mutation__

这一个比较少用，表示积木变体。常见于 `procedures_prototype` 和 `procedures_definition`中。

`"mutation":{...}`

?:只在 `control_stop` 中有 !: 在`procedures_prototype` 和 `procedures_call` 中有 !!:只在 `procedures_prototype` 中有

| 名字             | 说明                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| tagName          |   文本"mutation"                                                                   |
| children         |   空数组[]                                                                         |
| hasnext          | ? 能否在后面连接积木（选择`停止该角色的其他脚本`时为`true`）                       |
| proccode         | ! 积木定义代码(%s表示文本，%b表示条件，%n表示数字)                                 |
| argumentids      | ! 参数的id                                                                         |
| argumentNames    | !!参数的名字（其实你可以在这个积木的inputs里面获取）                               |
| argumentdefaults | !!参数默认值                                                                       |
| warp             | ! 运行时不刷新屏幕                                                                 |

monitors
--------

monitors 用于表示舞台上的变量显示。

`"monitors":[{...},{...},...]`

| 名字       | 说明                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| id         | 类型
| mode       | 显示模式
| opcode     | 显示类型（`类型名_操作名`)
| params     | 参数
| spriteName | 角色名（null:舞台）
| value      | 当前数值
| width      | 宽度
| height     | 高度
| x          | x坐标
| y          | y坐标
| visible    | 是否显示
| sliderMin  | 滑块最小值
| sliderMax  | 滑块最大值
| isDiscrete | 是否允许滑块选择小数

__id,opcode__

id的功能应该只是区分不同的monitors，但是既然它与opcode有一点关联那不妨也提一下  
[角色id]为随机生成，目前没看到它在除monitors之外的地方出现。  
[参数NUMBER_NAME] 指params参数中参数NUMBER_NAME的值

edit: id放在后面

如果你使用文本编辑器打开，请忽略下面的\号

| id                                             | opcode                       | 说明                                                     |
| ---------------------------------------------- | ---------------------------- | -------------------------------------------------------- |
| loudness                                       | sensing_loudness             | 响度                                                     |
| [列表id]                                       | data_listcontents            | 列表，参数 LIST: 列表名                                  |
| [角色id]\_xposition                            | motion_xposition             | x坐标                                                    |
| [角色id]\_yposition                            | motion_yposition             | y坐标                                                    |
| [角色id]\_direction                            | motion_direction             | 方向                                                     |
| [角色id]\_costumenumbername_[参数NUMBER_NAME]  | looks_costumenumbername      | 造型[名称/编号]，参数 NUMBER_NAME: number 编号 name 名称 |
| backdropnumbername_[参数NUMBER_NAME]           | looks_backdropnumbername     | 背景[名称/编号]，参数 NUMBER_NAME: number 编号 name 名称 |
| [角色id]\_volume                               | sound_volume                 | 音量                                                     |
| answer                                         | sensing_answer               | 回答                                                     |
| timer                                          | sensing_timer                | 计时器                                                   |
| current_[参数CURRENT_MENU小写]		 | sensing_current              | 当前时间，参数 CURRENT_MENU: YEAR年, ...                 |
| sensing_username				 | sensing_username             | 用户名                                                   |
| [变量id]					 | data_variable	        | 变量，参数 VARIABLE: 变量名                              |
| music_getTempo				 | music_getTempo	        | 音乐演奏速度                                             |
| translate_getViewerLanguage			 | translate_getViewerLanguage  | 翻译:访客语言                                            |

目前还未收录硬件拓展和非原生sc拓展。

__mode__

| 名字    | 说明 |
| ------- | ---- |
| default | 普通 |
| large   | 大字 |
| slider  | 滑块 |
| list    | 列表 |

```
你之所以在删除所有拓展的积木后重新加载却无法彻底删除拓展，可能是因为拓展相关内容被写到了monitor中，即使它被隐藏。
```

extensions
----------

表示作品中使用的拓展的列表。

`"extensions":[...]`

已支持的拓展：

| 名字         | 说明                                          |
| ------------ | --------------------------------------------- |
| music        | 音乐                                          |
| pen          | 画笔                                          |
| videoSensing | 视频侦测                                      |
| text2speech  | 文字朗读                                      |
| translate    | 翻译                                          |
| makeymakey   | Makey Makey                                   |
| tw           | TurboWarp                                     |
| lazyaudio    | 稽木世界:LazyAudio                            |
| canvas       | 稽木世界:Canvas                               |
| stringExt    | 稽木世界:String Extension                     |
| js           | 稽木世界:JavaScript                           |
| community    | 稽木世界:Community                            |
| puzzle       | 稽木世界:Puzzle                               |
| kinect       | 稽木世界:Kinect                               |
| community    | 共创世界:社区(虽然和 稽木世界 用的是一个单词) |
| lazyMusic    | 共创世界:音乐懒加载                           |
| text         | 艺术字                                        |
| faceSensing  | 面部识别                                      |
| box2d        | 物理引擎                                      |
| redBoard     | 共创世界:小红板                               |

meta
----

表示编辑器的信息。

| 名字   | 说明                                          |
| ------ | --------------------------------------------- |
| semver | Scratch的版本(不确定)
| vm     | Scratch vm的版本(不确定)
| agent  | 浏览器UA

Scratch文件表示数据结构
=======================
结构是这样：  
 - `tnode` - 数据位置(一定是数字)，也就是子节点所在tdata的开始位置。
 - `tdata` - 数据数值(可能是数字，文字)，当它是数字时它就是它表示的树根在tnode的位置。

树中节点有两种：  
 - 有子节点，无数据的星号(-\*)节点，
 - 无子节点，有数据的引号(-"xxx")节点，
 - 无子节点，无数据的X号(-X)节点，

```
-* (1)
 |-"角色1"  ------------------------ [1]
 |-* (2)  -------------------------- [2]
 | |-"造型1"  ---------------------- [4]
 | |-"造型2"  ---------------------- [5]
 | \-"造型3"  ---------------------- [6]
 \-* (3)  -------------------------- [3]
   \-* (4)  ------------------------ [7]
     |-"event_whenflagclicked" ----- [8]
     |-* (5)  ---------------------- [9]
     | |-"motion_gotoxy"  ---------- [11]
     | |-* (6)  -------------------- [10]
     | | |-"[文本]"  --------------- [14]
     | | \-"10"  ------------------- [15]
     | \-X  ------------------------ [13]
     \-* (7)  ---------------------- [12]
       |-"control_stop"  ----------- [16]
       \-X  ------------------------ [17]
```
那么，结构就会是这样：(数字旁边的括号只是为了方便理解)
```
	编号	tnode	编号	tdata
	(1)	[1]	[1]	"角色1"
			[2]	(2)
			[3]	(3)
	(2)	[4]	[4]	"造型1"
			[5]	"造型2"
			[6]	"造型3"
	(3)	[7]	[7]	(4)
	(4)	[8]	[8]	"event_whenflagclicked"
			[9]	(5)
			[10]	(6)
	(5)	[11]	[11]	"motion_gotoxy"
			[12]	(7)
			[13]	X(-1)
	(6)	[14]	[14]	"[文本]"
			[15]	"10"
	(7)	[16]	[16]	"control_stop"
			[17]	X(-1)
```
这意味着(1)号节点后面有[1]\[2][3]三个数据，分别是"角色1"，节点(2)和节点(3)，  
而节点2后面有[4]\[5][6]三个数据，节点(3)后面有[7]一个数据。

可以看到每个节点的数据的数量是由当前节点的tnode值和下一节点的tnode值决定，换句话说，  
节点(x)的数据是从`tnode(x)`开始，到`tnode(x+1)-1`结束的。(最后一个节点例外)

__当然，开始的节点不一定是(1)，事实上开始的节点编号可能会是一个很大的数字。__

不过你也许会问，实际应用的时候tdata列表里没有括号或者双引号，  
那么我怎么判断tdata里的 2 到底是 (2) 还是 "2" 呢？  
不用担心，树具有一定的规律，可以通过规律判断出数据的类型。

文件的树的样子
==============
文件的树长这样：

```
-* (作品)
 |-* (角色)
 | |-"角色1" (名字)
 | |-* (造型列表)
 | | |-"造型1"
 | | |-"造型2"
 | | \-"造型3"
 | |-* (声音列表)
 | | |-"声音1"
 | | |-"声音2"
 | | \-"声音3"
 | |-* (广播列表)
 | | |-"广播1"
 | | |-"广播2"
 | | \-"广播3"
 | |-* (变量列表)
 | | |-"变量1"
 | | |-"变量2"
 | | \-"变量3"
 | |-* (列表列表)
 | | |-"列表1"
 | | |-"列表2"
 | | \-"列表3"
 | |-* (定义列表)
 | | |-"定义1"
 | | |-"定义2"
 | | \-"定义3"
 | \-* (积木列表)
 |   |-* (开头积木1)
 |   | |-"event_whenflagclicked" (积木名称，当绿旗被点击)
 |   | \-* (下一个积木)
 |   |   |-"motion_gotoxy" (积木名称，移到 x： ( )， y： ( ))
 |   |   |-* (参数1)
 |   |   | |-"[文本]" (文本)
 |   |   | \-"10"
 |   |   |-* (参数2)
 |   |   | |-"operator_add" (积木名称，( )+( ))
 |   |   | |-* (参数1)
 |   |   | | |-"[文本]" (文本)
 |   |   | | \-"10"
 |   |   | |-* (参数2)
 |   |   | | |-"motion_yposition" (积木名称，(y坐标))
 |   |   | | \-X (下一个积木)
 |   |   | \-X (下一个积木)
 |   |   \-X (下一个积木)
 |   \-* (开头积木2)
 |     |- ... (省略)
 |     .
 |     .
 |     \-(省略)
 \-* (角色2)
   |- ... (省略)
   .
   .
   \-(省略)
```

感觉看起来很乱？下面仔细说明

作品节点
--------

作品由多个角色构成，像这样：

```
-* (作品)
 |-* (角色1)
 |-* (角色2)
 |-* (角色3)
 .
 .
 .
 \-* (角色N)
```

角色节点
--------

角色由名称，造型，声音，变量，列表，定义积木，积木构成。

```
-* (角色)
 |-"角色1" (名字)
 |-* (造型列表)
 |-* (声音列表)
 |-* (变量列表)
 |-* (列表列表)
 |-* (定义列表)
 \-* (积木列表)
```

造型节点(声音，变量，列表，定义同理)
--------

造型节点就是造型名字的列表

```
-* (造型)
 |-"造型1"
 |-"造型2"
 |-"造型3"
 .
 .
 .
 \-"造型N"
```
注意：在定义节点中，奇数项是名称，偶数项是位置。
积木列表
--------

积木列表中的每一项表示一组积木。

```
-* (积木列表)
 |-* (积木节点1)
 |-* (积木节点2)
 |-* (积木节点3)
 .
 .
 .
 \-* (积木节点N)
```

积木节点
--------

积木节点有三种

1. 空节点

```
-X
```
表示没有积木拼接，或者没有下一个积木。

2. 积木节点

```
-* (积木节点)
 |-"motion_gotoxy" (积木类型)
 |-* (下一个积木的位置)
 |-* (参数1)
 |-* (参数2)
 .
 .
 .
 \-* (参数N)
```

3. 文字节点

```
-* (文字节点)
 |-"[文本]" (文字类型)
 \-"123123" (文字)
```

其中，文字类型有：

| 类型名     | 解释                             |
| ---------- | -------------------------------- |
| [文本]     | 表示一个文本(可能是选项或者输入) |
| [变量]     | 表示一个变量                     |
| [列表]     | 表示一个列表                     |
| [选项]     | 表示一个下拉选项                 |
| [参数]     | 表示一个自定义积木参数           |
| [布尔参数] | 表示一个自定义积木六边形参数     |

特殊的积木节点
--------------

1. 自定义积木定义 `procedures_definition`

```
-* (积木节点)
 |-"procedures_definition" (积木类型)
 |-"积木2 %s %s %s" (积木标签) [1]
 |-* (定义的积木)
 |-* (变量1)
 |-* (变量2)
 |-* (变量3)
 .
 .
 .
 \-* (变量N)

[1]： 如果积木开启了运行时不刷新屏幕，那么最后面会多一个"%"号
```

2. 自定义积木使用

```
-* (积木节点)
 |-"procedures_call" (积木类型)
 |-"积木2 %s %s %s" (积木标签) [1]
 |-* (下一个积木)
 |-* (变量1)
 |-* (变量2)
 |-* (变量3)
 .
 .
 .
 \-* (变量N)

[1]： 同样，如果积木开启了运行时不刷新屏幕，那么最后面会多一个“%”号
```