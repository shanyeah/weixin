$(function(){
    if(appIni.login()==null){
        return;
    }
	var cid = '';
	getcid();
    createOperationTab();

    ajaxCGI({
        url:"my",
        jsonData:{},
        success:function(data){
            idNumber = data.idNumber;
        }
    });

	function getcid() {
		ajaxCGI({
			url:'myqrcode',
			jsonData:{},
			success:function(data){
				cid = data;
				barcode();
				setTimeout(getcid,1000*60);
			}
		})
	}
	
	function barcode() {		
		//二维码
		$('.rcode1 canvas').remove();
		$(".rcode1").qrcode({ 
		    render: "canvas", //table方式 
		    width: 200, //宽度 
		    height:200, //高度 
		    text: cid //任意内容 
		});
	}

	function createOperationTab(){
        //生成操作表
        ajaxCGI({
            url:"stglist",
            jsonData:{
                orderType: 1,
                pageNum: 1,
                pageSize: 100,
                latitude:getCookieValue('latitude'),
                longitude:getCookieValue('longitude')
            },
            success:function(data){
                var stgList = data.list;
                var btnList = [{text: '请选择店',label: true}];
                for(var i=0; i<stgList.length; i++){
                    var stgData = stgList[i];
                    btnList.push({text:stgData.name, stgId:stgData.id, onClick: function(){
                        linkRechargeUrl(this.stgId);
                    }});
                }

                $(document).on('click','#cardChargeLink', function () {
                    var buttons2 = [
                        {
                            text: '取消',
                            bg: 'danger'
                        }
                    ];
                    var groups = [btnList, buttons2];
                    $.actions(groups);
                });
            }
        });
	}

    ajaxCGI({
        url:"carddetail",
        jsonData:{},
        success:function(data){
            $('#cashBalance').text((data.cashBalance/100).toFixed(2)+" 元");
            $('#presentBalance').text((data.presentBalance/100).toFixed(2)+" 元");
            $('#magicCoin').text((data.magicCoin/100).toFixed(2)+" 魔元");
            $('#cardCategoryName').text(data.cardCategoryName);
        }
    });
});