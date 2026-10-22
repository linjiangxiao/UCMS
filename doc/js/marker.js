/* 模板标签设置:默认 {{ }} 。不再使用cookie(本地file://打开时cookie不可用导致取到undefined),
   改用localStorage保存,若浏览器禁用localStorage则退化为当前页面的内存变量 */
var UcmsTags = {
	start: '{{',
	end: '}}',
	key: 'ucms_template_tags',
	load: function(){
		try {
			var raw = (window.localStorage ? window.localStorage.getItem(this.key) : null);
			if (raw) {
				var obj = JSON.parse(raw);
				if (obj && typeof obj.start === 'string' && obj.start !== '') { this.start = obj.start; }
				if (obj && typeof obj.end === 'string' && obj.end !== '') { this.end = obj.end; }
			}
		} catch (e) {}
		return { start: this.start, end: this.end };
	},
	save: function(start, end){
		this.start = (start || '{{');
		this.end = (end || '}}');
		try {
			if (window.localStorage) {
				window.localStorage.setItem(this.key, JSON.stringify({ start: this.start, end: this.end }));
			}
		} catch (e) {}
	}
};

$(function(){
	$.fn.extend({
		appendval:function(val1){
			$(this).val($(this).val()+val1);
		}
	});
	//标签设置:默认{{ }} ,不再使用cookie(本地file://打开时cookie不可用,会取到undefined)
	var tagset = UcmsTags.load();
	tag_start = tagset.start;
	tag_end = tagset.end;
	$('#template_start_tag').val(tag_start);
	$('#template_end_tag').val(tag_end);
	$('.template_tag_input').focus(function(){
		
	});
	$('.markersetting').click(function(){
		$('#savetags').val("保存");
		$('.marker_setdiv').fadeIn();
	});
	$('#savetags').click(function(){
		UcmsTags.save($('#template_start_tag').val(), $('#template_end_tag').val());
		tag_start = UcmsTags.start;
		tag_end = UcmsTags.end;
		$('#savetags').val("保存成功");
		$('.marker_setdiv').fadeOut('slow');
	});
	$('#cancel_tags').click(function(){
		$('.marker_setdiv').fadeOut('fast');
		$('#template_start_tag').val(UcmsTags.start);
		$('#template_end_tag').val(UcmsTags.end);
	});
	
	$('.markermenu li').click(function(){
		$('.markermenu li').removeClass('on');
		$(this).addClass('on');
		$('.markerarea').hide();
		$('#marker'+$(this).index()).show();
	});
	$('.markerbutton').click(function(){
		rel=$(this).attr('rel');
		val=$(this).val();
		kind=$('.markermenu li.on').text();
		_czc.push(['_trackEvent', '助手', kind, val,'','dafen']);
		$('#code').val("");
		//从设置框读取标签,为空则回落到默认的{{ }} ,避免出现undefined
		tag_start=$('#template_start_tag').val() || '{{';
		tag_end=$('#template_end_tag').val() || '}}';
		UcmsTags.start=tag_start;
		UcmsTags.end=tag_end;
		switch (rel)
		{
			case "0_1":
				$('#code').appendval(tag_start+"hello ucms"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"`\"hello\".\" ucms\""+tag_end+"\r\n");
				$('#code').appendval(tag_start+"`1+1"+tag_end);
			break;
			case "0_2":
				$('#code').appendval(tag_start+"$a=hello ucms"+tag_end);
			break;
			case "0_3":
				$('#code').appendval(tag_start+"$a"+tag_end);
			break;
			case "0_4":
				$('#code').appendval("直接输出结果:"+tag_start+"intval(123ucms)"+tag_end+"\r\n");
				$('#code').appendval("将结果传给变量:"+tag_start+"$a=intval(123ucms)"+tag_end+"\r\n");
				$('#code').appendval("运算符 ` :"+tag_start+"$a=`1+2*3+4"+tag_end+" ");
			break;
			case "0_5":
				$('#code').appendval(tag_start+"123ucms|intval()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$a=123ucms|intval()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$a=123ucms|intval()|text(2)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$a=123ucms|intval()|str_replace(1,2,this)"+tag_end);
			break;
			case "0_6":
				$('#code').appendval("模板引擎语法中为了防止输出某些字符串时造成模板引擎解析错误,对某些字符串需要进行转义\r\n");
				$('#code').appendval("单引号'    等号=    逗号,   竖杠|    前括号(    后括号)    斜杠\\ \r\n");
				$('#code').appendval("如需在"+tag_start+""+tag_end+"之间输出以上字符串,需在前面加上\\,如\r\n");
				$('#code').appendval(tag_start+"$a='\\='"+tag_end+"\r\n"+tag_start+"$a"+tag_end);
				$('#code').appendval("会输出=号,否则将解析错误\r\n");
				$('#code').appendval("模板引擎会解析同一行中"+tag_start+"与"+tag_end+"之间的语法,如您需要输出"+tag_start+"或"+tag_end+",请确保它们不在同一行");
			break;
			case "0_7":
				$('#code').appendval(tag_start+"$a=1"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $a==1"+tag_end+"\r\n");
				$('#code').appendval("    a的值为1\r\n");
				$('#code').appendval(tag_start+"elseif $a==2"+tag_end+"\r\n");
				$('#code').appendval("    a的值为2\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    a的值为其他\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");
				$('#code').appendval("if判断与php语法一致");
			break;
			case "0_8":
				$('#code').appendval("循环一个数组,输出文章列表时常用"+"\r\n");
				$('#code').appendval(tag_start+"$a=array(1,2,3)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $a as $i"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$i"+tag_end+"/\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
				$('#code').appendval("判断条数:"+"\r\n");
				$('#code').appendval(tag_start+"loop $a as $key=>$i"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $key==0"+tag_end+"\r\n");
				$('#code').appendval("第一条:"+tag_start+"$i"+tag_end+"/\r\n");
				$('#code').appendval(tag_start+"elseif $key==1"+tag_end+"\r\n");
				$('#code').appendval("第二条:"+tag_start+"$i"+tag_end+"/\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("其他:"+tag_start+"$i"+tag_end+"/\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");

				
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "0_9":
				$('#code').appendval(tag_start+"file top.php"+tag_end+"\r\n");
				$('#code').appendval("如您不加上后缀.php,如"+tag_start+"file top"+tag_end+"则等同于"+tag_start+"file top.php"+tag_end+"\r\n");
				$('#code').appendval("引入的模板位置是相对于模板目录的\r\n");
				$('#code').appendval("如手机站首页需要引入手机站的top.php则为"+tag_start+"file m/top"+tag_end);
			break;
			case "0_15":
				$('#code').appendval(tag_start+"class markdown.php"+tag_end+"\r\n");
				$('#code').appendval("如您不加上后缀.php,如"+tag_start+"class markdown"+tag_end+"则等同于"+tag_start+"class markdown.php"+tag_end+"\r\n");
				$('#code').appendval("引入的文件位置存放于inc目录下\r\n");
			break;
			case "0_10":
				$('#code').appendval("首页网址:"+tag_start+"homeurl"+tag_end);
			break;
			case "0_11":
				$('#code').appendval("当前域名:"+tag_start+"host"+tag_end);
			break;
			case "0_12":
				$('#code').appendval("安装目录:"+tag_start+"ucmsdir"+tag_end);
			break;
			case "0_13":
				$('#code').appendval(tag_start+"tempdir"+tag_end+"\r\n\r\n");
				$('#code').appendval("引入模板目录下的样式文件:\r\n");
				$('#code').appendval("<link rel=\"stylesheet\" type=\"text/css\" href=\""+tag_start+"tempdir"+tag_end+"css/style.css\" />\r\n");
				$('#code').appendval("引入模板目录下的js文件:\r\n");
				$('#code').appendval("<script src=\""+tag_start+"tempdir"+tag_end+"js/js.js\"></script>");
			break;
			case "0_14":
				$('#code').appendval(tag_start+"//这里是注释~，只支持单行"+tag_end);
			break;
			case "1_1":
				if (!alertinput('sitevarname',1)){return false;}
				$('#code').appendval(tags("z("+idval('sitevarname')+")"));
			break;
			case "1_2":
				$('#code').appendval(tag_start+"$a=strset(站点标题,新的网站标题)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $a"+tag_end+"\r\n");
				$('#code').appendval("    设置成功\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "1_3":
				$('#code').appendval("<title>"+tag_start+"z(站点标题)"+tag_end+"</title>\r\n");
				$('#code').appendval("<meta name=\"keywords\" content=\""+tag_start+"z(关键词)"+tag_end+"\"/>\r\n");
				$('#code').appendval("<meta name=\"description\" content=\""+tag_start+"z(描述)"+tag_end+"\"/>");
			break;
			case "1_4":
				$('#code').appendval(tag_start+"$a=z(变量名)"+tag_end);
			break;
			case "1_5":
				$('#code').appendval(tag_start+"z(变量名)|text(10)"+tag_end);
			break;
			case "1_7":
				$('#code').appendval(tag_start+"$a=z(勾选框变量名)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $a==1"+tag_end+"\r\n");
				$('#code').appendval("    勾选了\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    没勾选\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "1_8":
				$('#code').appendval(tag_start+"$pics=z(多图变量名)|json_decode(1)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $pics as $pic"+tag_end+"\r\n");
				$('#code').appendval("    <img src=\""+tag_start+"$pic"+tag_end+"\">\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "1_9":
				$('#code').appendval(tag_start+"$a=z(变量名)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['cid']=1"+tag_end+tag_start+"//变量来源栏目名或cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['all']=0"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id']=$a"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article=a($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $article"+tag_end+"\r\n");
				$('#code').appendval("    您选择了:"+tag_start+"$article['title']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    文章不存在了\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "2_1":
				if (!alertinput('channelvarname',1)){return false;}
				$('#code').appendval(tags("s("+idval('channelvarname')+")"));
			break;
			case "2_2":
				if (!alertinput('otherchannelvarname',1)){return false;}
				if (!alertinput('cname',1)){return false;}
				$('#code').appendval(tags("s("+idval('otherchannelvarname')+","+idval('cname')+")"));
			break;
			case "2_3":
				$('#code').appendval(tag_start+"$a=s(变量名)"+tag_end);
			break;
			case "2_4":
				$('#code').appendval(tag_start+"s(变量名)|text(10)"+tag_end);
			break;
			case "2_5":
				$('#code').appendval(tag_start+"$a=s(勾选框变量名)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $a==1"+tag_end+"\r\n");
				$('#code').appendval("    勾选了\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    没勾选\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "2_6":
				$('#code').appendval(tag_start+"$pics=s(多图变量名)|json_decode(1)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $pics as $pic"+tag_end+"\r\n");
				$('#code').appendval("    <img src=\""+tag_start+"$pic"+tag_end+"\">\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "2_7":
				$('#code').appendval(tag_start+"$a=s(变量名)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['cid']=1"+tag_end+tag_start+"//变量来源栏目名或cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['all']=0"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id']=$a"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article=a($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $article"+tag_end+"\r\n");
				$('#code').appendval("    您选择了:"+tag_start+"$article['title']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    文章不存在了\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "2_8":
				$('#code').appendval(tag_start+"s(内容,公司简介)|text(200)"+tag_end);
			break;
			case "2_9":
				$('#code').appendval(tag_start+"$ids=z(多选框)|json_decode(1)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $ids as $id"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['cid']=1"+tag_end+tag_start+"//变量来源栏目名或cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['all']=0"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id']=$id"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article=a($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $article"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$article['title']"+tag_end+"|\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    文章不存在了\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "2_10":
				$('#code').appendval(tag_start+"$a=strset(栏目标题,新的栏目标题,栏目cid)"+tag_end+tag_start+"//如果更改的是当前栏目,则可以删除最后一个参数"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $a"+tag_end+"\r\n");
				$('#code').appendval("    设置成功\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "2_11":
				$('#code').appendval("<title>"+tag_start+"s(栏目标题)"+tag_end+"</title>\r\n");
				$('#code').appendval("<meta name=\"keywords\" content=\""+tag_start+"s(栏目关键词)"+tag_end+"\"/>\r\n");
				$('#code').appendval("<meta name=\"description\" content=\""+tag_start+"s(栏目描述)"+tag_end+"\"/>");
			break;
			case "3_1":
				if (!alertinput('temppage_size',3)){return false;}
				if (!alertinput('listcachetime',3)){return false;}
				if (!alertinput('articlecolumn',4)){return false;}
				if (!alertinput('articleorder',4)){return false;}
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				if (idval('cname_3'))
				{
					$('#code').appendval(tag_start+"$set['cid']="+idval('cname_3')+""+tag_end+"\r\n");
				}
				if (idval('temppage_size'))
				{
					$('#code').appendval(tag_start+"$set['pagesize']="+idval('temppage_size')+""+tag_end+"\r\n");
				}
				if ($('#pagelist').prop('checked'))
				{
					//$('#code').appendval("{if isset($_GET['page'])}\r\n");
					//$('#code').appendval("    {$set['page']=intval($_GET['page'])}\r\n");
					//$('#code').appendval("{else}\r\n");
					//$('#code').appendval("    {$set['page']=1}\r\n");
					//$('#code').appendval("{/if}\r\n");
					$('#code').appendval(tag_start+"$set['page']=page"+tag_end+"\r\n");
					//$('#code').appendval("老版本请查看\r\n");
					
				}
				if (idval('listcachetime') && idval('listcachetime')>0)
				{
					$('#code').appendval(tag_start+"$set['cache']="+idval('listcachetime')+""+tag_end+"\r\n");
				}
				if (idval('articlecolumn') && idval('articlecolumn')!='*')
				{
					$('#code').appendval(tag_start+"$set['column']="+idval('articlecolumn')+""+tag_end+"\r\n");
				}
				if (idval('articleorder'))
				{
					$('#code').appendval(tag_start+"$set['order']="+idval('articleorder')+""+tag_end+"\r\n");
				}
				
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("    <a href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
				if ($('#pagelist').prop('checked'))
				{
					$('#code').appendval(tag_start+"//分页:"+tag_end+tag_start+"pagelist($articles)"+tag_end);
					
				}
			break;
			case "3_2":
				$('#code').appendval(tag_start+"$set['where']['id']=1"+tag_end);
			break;
			case "3_3":
				$('#code').appendval(tag_start+"$set['where']['id'][]=1"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id'][]=2"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id'][]=3"+tag_end);
			break;
			case "3_4":
				$('#code').appendval(tag_start+"$set['where']['fid']=1"+tag_end);
			break;
			case "3_5":
				$('#code').appendval(tag_start+"$set['where']['fid']=getkinds(3,12)"+tag_end+"\r\n");
				$('#code').appendval("注意:getkinds函数获取栏目cid为3下面id为12的所有子分类和自身,返回数组,来源栏目下必须有fid字段");
			break;
			case "3_6":
				$('#code').appendval(tag_start+"$set['nowhere']['id']=1"+tag_end);
			break;
			case "3_7":
				$('#code').appendval(tag_start+"$set['nowhere']['id'][]=1"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['nowhere']['id'][]=2"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['nowhere']['id'][]=3"+tag_end+"\r\n");
			break;
			case "3_8":
				$('#code').appendval(tag_start+"$set['inwhere']['kind'][]=1"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['inwhere']['kind'][]=2"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['inwhere']['kind'][]=3"+tag_end+"\r\n");
				$('#code').appendval("查询出kind字段中勾选了id=1和id=2和id=3的文章,此参数适合多选字段中分类的查询");
			break;
			case "3_9":
				$('#code').appendval(tag_start+"$set['other']=\"fid\\=1 and ifcheck\\=1\""+tag_end+"\r\n");
				$('#code').appendval("自定义查询条件拼接sql,注意模板中=号需要转义,所以需要在=前加\\");
				$('#code').appendval("请确保查询条件中的数据的安全性,使用dbstr函数对数据进行转义");
			break;
			case "3_10":
				$('#code').appendval(tag_start+"$set['where']['ifcheck']=1"+tag_end);
			break;
			case "3_11":
				$('#code').appendval(tag_start+"$set['start']=10"+tag_end);
			break;
			case "3_12":
				$('#code').appendval(tag_start+"$set['keyword']=搜索关键词"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['searchcolumn']=title,keywords,content"+tag_end+tag_start+"//自定义搜索字段,如果没有此参数则只查询title字段"+tag_end);
				$('#code').appendval(tag_start+"//1.3.6版本开始支持用数组或|分割的字符串方式传入多个关键词查询"+tag_end);
			break;
			case "3_13":
				$('#code').appendval(tag_start+"$set['domain']=uuu.la"+tag_end+"\r\n");
				$('#code').appendval("如果一个栏目有多个域名,则可通过此参数设定文章网址的域名");
			break;
			case "3_14":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("     序号:"+tag_start+"$a['key']"+tag_end+":<a href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a><br>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_15":
				$('#code').appendval(tag_start+"$set['nowhere']['pic']=''"+tag_end);
			break;
			case "3_16":
				$('#code').appendval(tag_start+"$set['tablename']=表名"+tag_end+"\r\n");
				$('#code').appendval("从指定的表名中读取文章列表,使用此参数时不要使用$set['cid']指定栏目");
			break;
			case "3_17":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['rowstyle'][1]=' class\\=\"on\"'"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("     <a "+tag_start+"$a['rowstyle']"+tag_end+" href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a><br>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_18":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['stepstyle'][3]=' class\\=\"on\"'"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("     <a "+tag_start+"$a['stepstyle']"+tag_end+" href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a><br>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_19":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['rowidstyle'][5]=' class\\=\"on\"'"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("     <a "+tag_start+"$a['rowidstyle']"+tag_end+" href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a><br>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_20":
				$('#code').appendval(tag_start+"$a['shijian']|date('Y-m-d H:i:s',this)"+tag_end);
			break;
			case "3_21":
				$('#code').appendval(tag_start+"$a['title']|text(10)"+tag_end);
			break;
			case "3_22":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['order']=id desc"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("    <a href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a><br>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_23":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['cids']=1;2;3"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['order']=id desc"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("    <a href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a><br>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_24":
				$('#code').appendval(tag_start+"$channels=c(2,4)"+tag_end+tag_start+"//获取4个文章栏目"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $channels as $channel"+tag_end+"\r\n");
				$('#code').appendval("    栏目名:"+tag_start+"$channel['name']"+tag_end+",栏目网址:"+tag_start+"$channel['url']"+tag_end+"<br>\r\n");
				$('#code').appendval("    文章:\r\n");
				$('#code').appendval("    "+tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$set['cid']=$channel['cid']"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$set['pagesize']=12"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$articles=alist($set)"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("        <a href=\""+tag_start+"$a['link']"+tag_end+"\">"+tag_start+"$a['title']"+tag_end+"</a>\r\n");
				$('#code').appendval("    "+tag_start+"/loop"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "3_25":
				$('#code').appendval(tag_start+"$a['content']|firstpic()"+tag_end+"\r\n");
			$('#code').appendval(tag_start+"//firstpic函数如下,请将代码放到页面头部"+tag_end+"\r\n");
			$('#code').appendval("<?php\r\n");
			$('#code').appendval("function firstpic($content) {\r\n");
			$('#code').appendval("    $pattern=\"/<img.*?src=[\\'|\\\"](.*?(?:[\\.gif|\\.jpg|\\.png|\\.bmp|\\.jpeg]))[\\'|\\\"].*?[\\/]?>/i\"; \r\n");
			$('#code').appendval("    preg_match_all($pattern,$content,$match); \r\n");
			$('#code').appendval("    Return isset($match[1][0]) ? trim($match[1][0]) : false ;\r\n");
			$('#code').appendval("}\r\n");
			$('#code').appendval("?>");
			break;
			case "3_26":
				$('#code').appendval(tag_start+"$set['all']=0"+tag_end);
			break;
			case "3_27":
				$('#code').appendval("文章列表循环时获取栏目名\r\n");
				$('#code').appendval(tag_start+"loop $articles['list'] as $a"+tag_end+"\r\n");
				$('#code').appendval("    栏目名:"+tag_start+"i(name,$a['cid'])"+tag_end+"\r\n");
				$('#code').appendval("    栏目网址:"+tag_start+"i(url,$a['cid'])"+tag_end+"\r\n");
				$('#code').appendval("    文章标题:"+tag_start+"$a['title']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
			break;
			case "4_1":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id']=intval($_GET['id'])"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article=a($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if !$article"+tag_end+"\r\n");
				$('#code').appendval("     "+tag_start+"notfound()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");
			break;
			case "4_2":
				$('#code').appendval("<title>"+tag_start+"$article['title']"+tag_end+"</title>\r\n");
				$('#code').appendval("<meta name=\"keywords\" content=\""+tag_start+"$article['keywords']"+tag_end+"\"/>\r\n");
				$('#code').appendval("<meta name=\"description\" content=\""+tag_start+"$article['description']"+tag_end+"\"/>");
			break;
			case "4_3":
				$('#code').appendval(tag_start+"$article['content']"+tag_end);
			break;
			case "4_4":
				$('#code').appendval(tag_start+"$article['shijian']|date('Y-m-d H:i:s',this)"+tag_end);
			break;
			case "4_5":
				$('#code').appendval(tag_start+"$pics=$article['pics']|json_decode(1)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $pics as $pic"+tag_end+"\r\n");
				$('#code').appendval("    <img src=\""+tag_start+"$pic"+tag_end+"\">\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "4_6":
				$('#code').appendval(tag_start+"$tags=$article['tag']|json_decode(1)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $tags as $tag"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$tag"+tag_end+" \r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "4_7":
				$('#code').appendval(tag_start+"$val=$article['fid']"+tag_end+tag_start+"//字段名"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['cid']=1"+tag_end+tag_start+"//字段来源的栏目cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['where']['id']=$val"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$fidarticle=a($set)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $fidarticle"+tag_end+"\r\n");
				$('#code').appendval("    您选择了:"+tag_start+"$fidarticle['title']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("    文章不存在了\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end);
			break;
			case "4_8":
				$('#code').appendval(tag_start+"$vals=$article['fid']|json_decode(1)"+tag_end+tag_start+"//字段名"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $vals as $val"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$set['cid']=1"+tag_end+tag_start+"//字段来源的栏目cid"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$set['where']['id']=$val"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"$fidarticle=a($set)"+tag_end+"\r\n");
				$('#code').appendval("    "+tag_start+"if $fidarticle"+tag_end+"\r\n");
				$('#code').appendval("        "+tag_start+"$fidarticle['title']"+tag_end+"|\r\n");
				$('#code').appendval("    "+tag_start+"else"+tag_end+"\r\n");
				$('#code').appendval("        文章不存在了\r\n");
				$('#code').appendval("    "+tag_start+"/if"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "4_9":
				$('#code').appendval("<?php\r\n");
				$('#code').appendval("$userid=$article['adminuid'];\r\n");
				$('#code').appendval("$admininfo=$query = $GLOBALS['db'] -> one(\"SELECT username,nickname FROM \".tableex('admin').\" where id='$userid';\");\r\n");
				$('#code').appendval("if(!$admininfo) {\r\n");
				$('#code').appendval("    $admininfo['username']='';\r\n");
				$('#code').appendval("    $admininfo['nickname']='';\r\n");
				$('#code').appendval("}\r\n");
				$('#code').appendval("?>\r\n");
				$('#code').appendval("管理员帐户:"+tag_start+"$admininfo['username']"+tag_end+"管理员昵称:"+tag_start+"$admininfo['nickname']"+tag_end);
			break;
			case "4_10":
				$('#code').appendval(tag_start+"$editinfo=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$editinfo['id']=$article['id']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$editinfo['click']=$article['click']+1"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$return=aedit($editinfo)"+tag_end+"\r\n");
				$('#code').appendval("此代码将当前文章的点击量加1,请先建立click字段(字段类型为:数字/排序),并将默认值设置为0");
			break;
			case "4_11":
				$('#code').appendval(tag_start+"$prevset=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$prevset['column']=id,title"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$prevset['order']=id desc"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$prevset['other']=`\"id<\".$article['id']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$prev=a($prevset)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $prev"+tag_end+"\r\n");
				$('#code').appendval("    上一篇:<a href=\""+tag_start+"$prev['link']"+tag_end+"\">"+tag_start+"$prev['title']"+tag_end+"</a>\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$nextset=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$nextset['column']=id,title"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$nextset['other']=`\"id>\".$article['id']"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$nextset['order']=id asc"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$next=a($nextset)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if $next"+tag_end+"\r\n");
				$('#code').appendval("    下一篇:<a href=\""+tag_start+"$next['link']"+tag_end+"\">"+tag_start+"$next['title']"+tag_end+"</a>\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"//注:此方法只能应用于按照id排序的方式获取上下篇的文章"+tag_end);
			break;
			case "5_1":
				$('#code').appendval(tag_start+"n()"+tag_end);
			break;
			case "5_2":
				$('#code').appendval(tag_start+"$set=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$set['cid']=`cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"n($set)"+tag_end+"\r\n");
				$('#code').appendval("此代码将输出当前栏目的导航栏列表(包含本栏目),如果此栏目下没有子栏目则会显示兄弟栏目与父栏目。");
			break;
			case "5_3":
				$('#code').appendval(tag_start+"$channels=c(0,999,0)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $channels as $channel"+tag_end+"\r\n");
				$('#code').appendval("        <a href=\""+tag_start+"$channel['url']"+tag_end+"\" class=\""+tag_start+"$channel['onstyle']"+tag_end+"\">"+tag_start+"$channel['name']"+tag_end+"</a>\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end+"\r\n");
				$('#code').appendval("列出子栏目,可以print_r($channel)查看栏目数组中的信息\r\n");
				$('#code').appendval("c函数中第一个参数为栏目的类型,1是单页栏目,2是文章栏目,3是链接\r\n");
				$('#code').appendval("c函数中第二个参数为获取栏目的数量\r\n");
				$('#code').appendval("c函数中第三个参数为父栏目的cid,不填或填0则获取顶级栏目\r\n");
				$('#code').appendval("1.4.1版本开始新增第四个参数,填1则只返回后台勾选导航栏显示的栏目");
			break;
			case "5_4":
				$('#code').appendval(tag_start+"u(栏目名字)"+tag_end+"\r\n");
				$('#code').appendval("可以传入栏目的cid或栏目名字");
			break;
			case "5_5":
				$('#code').appendval("当前位置:"+tag_start+"b()"+tag_end+"\r\n\r\n");
				$('#code').appendval("//自定义(返回数组,循环输出)"+"\r\n");
				$('#code').appendval(tag_start+"$breadcrumb=b(`cid,1)"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"loop $breadcrumb as $a"+tag_end+"\r\n");
				$('#code').appendval("<a href=\""+tag_start+"$a['url']"+tag_end+"\">"+tag_start+"$a['name']"+tag_end+"</a>"+"\r\n");
				$('#code').appendval(tag_start+"/loop"+tag_end);
			break;
			case "5_6":
				$('#code').appendval(tag_start+"file ***.php"+tag_end);
			break;
			case "5_7":
				$('#code').appendval("<link rel=\"stylesheet\" type=\"text/css\" href=\""+tag_start+"tempdir"+tag_end+"css/***.css\" />");
			break;
			case "5_8":
				$('#code').appendval("<script src=\""+tag_start+"tempdir"+tag_end+"js/***.js\"></script>");
			break;
			case "5_9":
				$('#code').appendval("<img src=\""+tag_start+"tempdir"+tag_end+"images/***.jpg\">");
			break;
			case "5_10":
				$('#code').appendval(tag_start+"$article=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['cid']=栏目名或栏目cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['title']=标题标题"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['content']=内容内容"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$id=ainsert($article)"+tag_end+"\r\n");
				$('#code').appendval("插入一篇文章。如果不填写栏目名或cid,则插入到当前的栏目中,返回的结果是新插入文章的id。");
			break;
			case "5_11":
				$('#code').appendval(tag_start+"$article=array()"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['id']=需要修改文章的id"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['cid']=栏目名或栏目cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['title']=新标题"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"$article['content']=新内容"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"aedit($article)"+tag_end+"\r\n");
				$('#code').appendval("修改一篇文章。文章id必须填写,如果不填写栏目名或cid,则修改当前栏目中的文章。");
			break;
			case "5_12":
				$('#code').appendval(tag_start+"adel(1,2)"+tag_end+"\r\n");
				$('#code').appendval("删除一篇文章。第一个参数是栏目的cid,第二个参数是文章的id");
			break;
			case "5_13":
				$('#code').appendval(tag_start+"uri(网址)"+tag_end+"\r\n");
				$('#code').appendval("当程序开启关闭伪静态或转移到子目录时,不用去模板中更改新的地址\r\n");
				$('#code').appendval("如"+tag_start+"uri(/news/)"+tag_end+",开启伪静态时网址为/news/ ,关闭伪静态时网址为/index.php/news/");
			break;
			case "5_14":
				$('#code').appendval("输出当前栏目cid:"+tag_start+"`cid"+tag_end+"\r\n");
				$('#code').appendval(tag_start+"if cid==2"+tag_end+"\r\n");
				$('#code').appendval("判断当前栏目cid是否为2"+"\r\n");
				$('#code').appendval(tag_start+"/if"+tag_end+"\r\n");
				$('#code').appendval("首页cid为0");
			break;
			case "5_15":
				$('#code').appendval("当前栏目的栏目名 "+tag_start+"i(name)"+tag_end+"\r\n");
				$('#code').appendval("当前栏目的网址 "+tag_start+"i(url)"+tag_end+"\r\n");
				$('#code').appendval("当前栏目的cid "+tag_start+"i(cid)"+tag_end+"\r\n");
			break;
			case "5_16":
				$('#code').appendval("当前栏目的父栏目cid "+tag_start+"i(fid)"+tag_end+"\r\n");
				$('#code').appendval("当前栏目的父栏目网址 "+tag_start+"i(fid)|i(url,this)"+tag_end+"\r\n");
				$('#code').appendval("当前栏目的父栏目名字 "+tag_start+"i(fid)|i(name,this)"+tag_end+"\r\n");
			break;
			case "5_17":
				$('#code').appendval("当前栏目的顶级栏目cid "+tag_start+"i(topfid)"+tag_end+"\r\n");
				$('#code').appendval("当前栏目的顶级栏目的栏目名 "+tag_start+"i(topfid)|i(name,this)"+tag_end+"\r\n");
				$('#code').appendval("当前栏目的顶级栏目的栏目变量调用 "+tag_start+"i(topfid)|s(栏目描述,this)"+tag_end+"\r\n");
			break;
			case "5_18":
				$('#code').appendval("调用某个栏目的栏目名 "+tag_start+"i(name,***)"+tag_end+"\r\n");
				$('#code').appendval("调用某个栏目的栏目网址 "+tag_start+"i(url,***)"+tag_end+" 或直接使用 "+tag_start+"u(***)"+tag_end+"\r\n");
				$('#code').appendval("*** 为栏目名或栏目cid\r\n");
			break;
		}
		$("#code").focus();
		//$("#code").select()
		$("#code").scrollTop(0);
		$("#code").css('border','2px solid #FF6600');
	});
	$("#code").blur(function(){
		$("#code").css('border','2px solid #ccc');
	});

});

function idval(id){
	return $('#'+id).val();
}
function tags(val){
	return tag_start+val+tag_end;
}
function varencode(val){
	return tag_start+val+tag_end;
}
function alertinput(id,kind){
	//1不能为空 2 必须是数字   3可以为空,或必须是数字 4可以空,不能是数字
	$('#'+id).attr('rel',kind);
	$('#'+id).bind('blur', function() { 
		alertinput(id,$(this).attr('rel'));
	});
	if (kind==1)
	{
		if ($('#'+id).val()=='')
		{
			$('#'+id).css('border','1px solid red');
			return false;
		}
	}
	if (kind==2)
	{
		if (isNaN($('#'+id).val()))
		{
			$('#'+id).css('border','1px solid red');
			return false;
		}
	}
	if (kind==3)
	{
		if ($('#'+id).val()!='')
		{
			if (isNaN($('#'+id).val()))
			{
				$('#'+id).css('border','1px solid red');
				return false;
			}
		}
	}
	if (kind==4)
	{
		if ($('#'+id).val()!='')
		{
			if (!isNaN($('#'+id).val()))
			{
				$('#'+id).css('border','1px solid red');
				return false;
			}
		}
	}
	$('#'+id).css('border','1px solid #ccc');
	$('#'+id).unbind("blur");
	return true;
}