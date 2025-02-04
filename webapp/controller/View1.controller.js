sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment"
], function(Controller, JSONModel, Filter, FilterOperator, Fragment) {
	"use strict";

	var oMainModel;

	return Controller.extend("BOND_TEST3.controller.View1", {

		onInit: function() {

			var TodayDate = new Date();
			var year = TodayDate.getFullYear();
			var month = (TodayDate.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
			var day = TodayDate.getDate().toString().padStart(2, '0'); // 날짜가 한 자리일 경우 앞에 0을 추가

			// YYYY.MM.DD 형식으로 변환
			var formattedDate = year + '.' + month + '.' + day;

			this.byId("companyCode").setValue("1000");
			this.byId("tradingDate").setValue(formattedDate);
			this.byId("curr").setValue("KRW");
			this.byId("sfhaart").setValue("100");

			var sUrl = "/sap/opu/odata/sap/ZPJ_BDTRAN_TEST_SRV/";
			oMainModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			this.getView().setModel(oMainModel);

		},

		// 종목조회
		onReadBdClass: function() {
			// 4000000001928
			var securityId = this.byId("securityId").getValue();
			if (securityId == "") {
				alert("null");
			} else {
				var oModelDetail = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPJ_BOND_TEST_SRV/");
				var sPath = "/Z_BDCLASSSet(SecurityId='" + securityId + "')";
				var that = this;

				oModelDetail.read(sPath, {

					success: function(oData, oResponse) {
						// alert("ok!!");

						var data = oData;
						that.byId("productType").setValue(data.ProductType); //상품유형
						that.byId("xsecClass").setValue(data.XsecClass); //유가증권분류
						that.byId("xbondClass").setValue(data.XbondClass); //채권분류
						that.byId("szbmeth").setValue(data.Szbmeth); //일수계산방법
						that.byId("itcd").setValue(data.Itcd); //이자지급방법
						that.byId("ittm").setValue(data.Ittm); //이자지급계산주기
						that.byId("issueDate").setValue(that.dateFormat(data.IssueDate)); //발 행 일
						that.byId("eddt").setValue(that.dateFormat(data.Eddt)); //만 기 일
						that.byId("cupr").setValue(data.Cupr); //표면이자율
						that.byId("ipyohal01").setValue(data.Ipyohal01); //할 인 율
						that.byId("hidt").setValue(that.dateFormat(data.Hidt)); //최초이자지급일
						that.byId("isin").setValue(data.Isin); //표준코드
						that.byId("xrfmd").setValue(data.Xrfmd); //상환방법

					},

					error: function(oError) {
						var lvErrTxt = oError.message;
						alert(lvErrTxt);
					}

				});

			}

		},

		// 조회 button
		onSelect: function() {

			var dealNumber = this.byId("dealNumber").getValue();
			var oFilter = new Filter([new Filter("DealNumber", FilterOperator.EQ, dealNumber)], false);
			// var oModelDetail = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPJ_BDTRAN_TEST_SRV/");

			var that = this;

			// oModelDetail.read("/Z_BDTRANSet", {
			oMainModel.read("/Z_BDTRANSet", {
				filters: [oFilter],
				success: function(oData, response) {
					// 		// // 1000000016439
					var data = oData.results;

					that.getView().byId("companyCode").setValue(data[0].CompanyCode); // 회사 코드
					that.getView().byId("securityId").setValue(data[0].SecurityId); // 종목ID
					that.getView().byId("productType").setValue(data[0].ProductType); // 상품유형
					that.getView().byId("sfhaart").setValue(data[0].Sfhaart); // 거래유형
					that.getView().byId("status").setValue(data[0].Status); // 상태
					that.getView().byId("zdataSrc").setValue(data[0].Zdatasrc); // 데이터구분

					that.getView().byId("expId").setValue(data[0].ExpId); // 구,포지션ID

					// that.getView().byId("curr").setValue(data[0].PaymentDate); // 통화

					var tradingDatePicker = that.getView().byId("tradingDate");
					tradingDatePicker.setValue(that.dateFormat(data[0].TradingDate));
					var payMentDatePicker = that.getView().byId("payMentDate");
					payMentDatePicker.setValue(that.dateFormat(data[0].PaymentDate));

					// that.getView().byId("tradingDate").setValue(that.dateFormat(data[0].TradingDate)); // 거래일
					// that.getView().byId("payMentDate").setValue(that.dateFormat(data[0].PaymentDate)); // 결제일

					that.getView().byId("nominalAmt").setValue(data[0].NominalAmt); // 액 면
					that.getView().byId("rrate").setValue(data[0].Rrate); // 수 익 률
					that.getView().byId("zprice1").setValue(data[0].Zprice1); // 계산단가
					that.getView().byId("zprice4").setValue(data[0].Zprice4); // 단가조정
					that.getView().byId("zprice2").setValue(data[0].Zprice2); // 적용단가
					// 		// // document.getElementById("xebert").value = data[0].Xebetr; // 시가 >> 
					that.getView().byId("tradeAmt").setValue(data[0].TradeAmt); // 매매금액
					that.getView().byId("settleAmt").setValue(data[0].SettleAmt); // 정산금액
					that.getView().byId("settleKAmt").setValue(data[0].SettleKamt); // 정산금액

					that.getView().byId("ininAmt").setValue(data[0].IntAmt); // 경과이자
					that.getView().byId("ininKAmt").setValue(data[0].IntKamt); // 경과이자

					that.getView().byId("kontrh").setValue(data[0].Kontrh); // 거 래 처
					that.getView().byId("hbkid").setValue(data[0].Hktid); // 당사계좌
					that.getView().byId("hktid").setValue(data[0].Hbkid); // 당사계좌

					that.getView().byId("sglzb").setValue(data[0].Sglzb); // 예 탁 처
					that.getView().byId("accNo").setValue(data[0].AccNo); // 결제계좌

					// 관리정보
					that.getView().byId("portfolio").setValue(data[0].Portfolio); // 계정구분
					that.getView().byId("accountGroup").setValue(data[0].AccountGroup); // 운용펀드
					that.getView().byId("manager").setValue(data[0].Manager); // 운용역
					that.getView().byId("operPart").setValue(data[0].OperPart); // 운용부서
					that.getView().byId("crnam").setValue(data[0].Crnam); // 사용자
					that.getView().byId("securityAccount").setValue(data[0].SecurityAccount); // 유가증권계정
					that.getView().byId("buyDate").setValue(data[0].BuyDate); // 매입결제일

					// 금융상품분류
					that.getView().byId("stBdGbn").setValue(data[0].StBdGbn); // 지분채무구분
					that.getView().byId("fvociYn").setValue(data[0].FvociYn); // FVOCI 지정여부
					that.getView().byId("fvociRsn").setValue(data[0].FvociRsn); // FVOCI 지정사유
					that.getView().byId("arsnText").setValue(data[0].ArsnText); // 기타사유
					that.getView().byId("comValClass").setValue(data[0].ComValClass); // 보유목적

					// 종목정보
					that.onReadBdClass();
					that.getView().byId("zfrate1").setValue(data[0].Zfrate1); //FRN RATE1
					that.getView().byId("zfrate2").setValue(data[0].Zfrate2); //FRN RATE2

					that.setSecurityText();
					that.setProductTypeText();
					that.setsfhaartText();
					that.setkontrhText();
					that.managerText();
					alert('조회 성공');

				},
				error: function(oError) {
					var lvErrTxt = oError.message;
					alert(lvErrTxt);

				},
				async: true

			});
		},

		// //////////////////////////////////////////////////////////////////종목ID TEXT - S
		// 	setSecurityText: function(){
		// 			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPJ_BDTRAN_TEST_SRV/");
		// 			sap.ui.getCore().setModel(oModel);			

		// 				var aFilters1 = [
		// 			    new sap.ui.model.Filter("Ranl", sap.ui.model.FilterOperator.EQ, this.getView().byId("securityId").getValue())
		// 			];

		// 			var that = this; 

		// 			oModel.read("/ZhcfmcmranlBdSet", {
		// 			    filters: aFilters1,
		// 			    success: function(oData) {
		// 			        var textValues = oData.results.map(function(item) {
		// 			            return item.Xallb;
		// 			        });
		// 			        that.getView().byId("securityText").setText(textValues.join(", "));
		// 			    },
		// 			    error: function(oError) {
		// 			    }
		// 			});			
		// 		},
		// //////////////////////////////////////////////////////////////////종목ID TEXT - E

		onRefresh: function() {
			location.reload();
		},

		dateFormat: function(oDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy.MM.dd."
			});

			var pDate = new Date(oDate);
			var sFormattedDate = oDateFormat.format(pDate);

			return sFormattedDate;
		},

		// 날짜를 OData 표준 형식으로 변환	
		oDataDtFormat: function(oValue) {

			var oDatePicker = this.getView().byId(oValue);
			var oDate = oDatePicker.getDateValue(); // Date 객체 반환

			console.log(oDate);

			var sFormatDate = null;

			if (oDate) {
				var oTimezoneDate = new Date(oDate.getTime() - (oDate.getTimezoneOffset() * 60000)); // 타임존 보정
				sFormatDate = oTimezoneDate.toISOString().split('.')[0]; // 'yyyy-MM-ddTHH:mm:ss' 형식
			}
			return sFormatDate;
		},

		///////////////////////////////////////////////////////////////  수정 전
		// 계산 
		// 	onCal: function( ){
		// 				// 		var tradingDateValue = tradingDatePicker.getValue();
		// 				// var PaymentDate = payMentDatePicker.getValue();

		// 			var oEntry = {
		// 				CompanyCode: this.getView().byId("companyCode").getValue(),
		// 				Zdatasrc: this.getView().byId("zdataSrc").getValue(),
		// 				SecurityId: this.getView().byId("securityId").getValue(),
		// 				Sfhaart: this.getView().byId("sfhaart").getValue(),
		// 				ProductType: this.getView().byId("productType").getValue(),

		// 				SecurityAccount: this.getView().byId("securityAccount").getValue(),
		// 				Rrate: this.getView().byId("rrate").getValue(),
		// 				NominalAmt: this.getView().byId("nominalAmt").getValue(),
		// 				NominalCurr: "KRW",

		// 				TradingDate: this.getView().byId("tradingDate").getValue(),	
		// 				PaymentDate: this.getView().byId("payMentDate").getValue()				
		// 			};

		// 				// PaymentDate: this.oDataDtFormat("payMentDate"),
		// 				// TradingDate: this.oDataDtFormat("tradingDate"),

		// 			console.log(oEntry);

		// 			var realTrade = this.getView().byId("realTrade").getSelected();
		// 			if (realTrade){
		// 				oEntry.PositionDate = this.oDataDtFormat("tradingDate");
		// 			}
		// 			else{
		// 				oEntry.PositionDate = this.oDataDtFormat("payMentDate");
		// 			}

		// 			// 계산구분
		// 			var calType = this.getView().byId("calType").getSelectedButton().getText(); 
		// 			if (calType === "단가"){
		// 				oEntry.Xzprice11 = "X";
		// 			}
		// 			else{
		// 				oEntry.Xzprice22 = "X";
		// 			}

		// 			oMainModel.create("/ZCalcDataSet", oEntry,{

		// 				success: function(oData, response){
		// 					alert("성공");
		// 				},
		// 				error: function(oError){
		// 					alert("실패");
		// 				},
		// 				async: false
		// 			});

		// 	},
		///////////////////////////////////////////////////////////////  수정 전
		onCal: function() {
			// Get values from the view
			var tradingDate = this.getView().byId("tradingDate").getValue();
			var payMentDate = this.getView().byId("payMentDate").getValue();

			// Convert dates to timestamps
			var tradingDateTimestamp = this.convertDateToTimestamp(tradingDate);
			var payMentDateTimestamp = this.convertDateToTimestamp(payMentDate);
			var that = this;

			// Construct the entry object
			var oEntry = {
				CompanyCode: this.getView().byId("companyCode").getValue(),
				// Zdatasrc: this.getView().byId("zdataSrc").getValue(),
				SecurityId: this.getView().byId("securityId").getValue(),
				Sfhaart: this.getView().byId("sfhaart").getValue(),
				ProductType: this.getView().byId("productType").getValue(),
				// SecurityAccount: this.getView().byId("securityAccount").getValue(),
				// Rrate: this.getView().byId("rrate").getValue(),
				NominalAmt: this.getView().byId("nominalAmt").getValue(),
				NominalCurr: "KRW",
				TradingDate: tradingDateTimestamp,
				PaymentDate: payMentDateTimestamp,
				// Zprice3: this.getView().byId("zprice2").getValue(),
				Xbnwhr: this.getView().byId("nominalAmt").getValue()
					// Rrate: this.getView().byId("rrate").getValue()
			};

			// Log the entry object
			console.log(oEntry);

			// Determine PositionDate based on realTrade selection
			// var realTrade = this.getView().byId("realTrade").getSelected();
			// if (realTrade) {
			//     oEntry.PositionDate = this.convertDateToTimestamp(tradingDate);
			// } else {
			//     oEntry.PositionDate = this.convertDateToTimestamp(payMentDate);
			// }

			// Calculate type
			var calType = this.getView().byId("calType").getSelectedButton().getText();
			console.log(calType);
			if (calType === "단가") {
				oEntry.Xzprice11 = "X";
				oEntry.Rrate = this.getView().byId("rrate").getValue();

			} else {
				oEntry.Xzprice22 = "X";
				oEntry.Zprice3 = this.getView().byId("zprice2").getValue();
			}

			// Create the data
			oMainModel.create("/ZCalcSet", oEntry, {
				success: function(oData, response) {
					alert("성공");

					console.log(oData);
					var Data = oData;

					if (calType === "단가") {
						that.byId("ininAmt").setValue(Data.AccuAmt); // 경과이자
						that.byId("ininKAmt").setValue(Data.AccuKamt); // 경과이자
						that.byId("settleAmt").setValue(Data.SettleAmt); // 정산금액
						that.byId("settleKAmt").setValue(Data.SettleKamt); // 정산금액
						that.byId("zprice1").setValue(Data.Zprice1); // 계산단가
						that.byId("zprice2").setValue(Data.Zprice3); // 적용단가
						that.byId("xbzbetr").setValue(Data.Bzbetrd); // 시가
						that.byId("tradeAmt").setValue(Data.TradeAmt); // 매매금액

					} else {
						that.byId("rrate").setValue(Data.Rrate);
						that.byId("zprice1").setValue(Data.Zprice1);
					}

				},
				error: function(oError) {
					alert("실패");
				},
				async: false
			});
		},

		convertDateToTimestamp: function(dateString) {
			var dateStr = dateString;

			// 문자열을 분리하여 연도, 월, 일을 추출
			var parts = dateStr.split(".");
			var year = parts[0];
			var month = parts[1];
			var day = parts[2];

			// 형식에 맞게 조합
			var formattedDate = year + month + day;
			return formattedDate;
			console.log(formattedDate);

		},

		// SEARCH HELP
		// Dialog open   
		onDialogOpen: function(oId) {
			var oView = this.getView();
			var oDialog = oView.byId(oId);

			oDialog.open();
		},

		// Dialog cancel	
		onDialogClose: function(oId) {
			this.getView().byId(oId).close();
		},

		// Dialog ok
		onDialogOk: function(oListId) {
			var oSelectedItem = this.getView().byId(oListId).getSelectedItem();
			var oContext = oSelectedItem.getBindingContext();
			var oSelectedData = oContext.getObject();

			return oSelectedData;
		},

		//////////////////////////////////////////////////////////////////회사코드 Value Help - S
		onCocdHelp: function(oEvent) {
			this.onDialogOpen("HCompanyCode");
		},

		onCocdOk: function(oEvent) {
			var SelectedData = this.onDialogOk("CoCdTable");
			var oData = SelectedData.Bukrs;

			if (oData) {
				this.getView().byId("companyCode").setValue(oData);
			}
			this.onDialogClose("HCompanyCode");
		},

		onCocdCancel: function(oEvent) {
			this.onDialogClose("HCompanyCode");
		},
		//////////////////////////////////////////////////////////////////회사코드 Value Help - E  

		//////////////////////////////////////////////////////////////////거래번호 Value Help - S
		onRfhaHelp: function(oEvent) {
			this.onDialogOpen("HRfha");
		},

		onRfhaOk: function(oEvent) {
			var SelectedData = this.onDialogOk("dealNumberTable");
			var oData = SelectedData.Rfha;

			if (oData) {
				this.getView().byId("dealNumber").setValue(oData);
			}
			this.onDialogClose("HRfha");
		},

		onRfhaCancel: function(oEvent) {
			this.onDialogClose("HRfha");
		},

		onRfhaSearch: function(oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Rfha", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("SecurityIdT", FilterOperator.Contains, sQuery));
			} else {
				aFilter.push(new Filter("Rfha", FilterOperator.Contains, sQuery));
			}

			var oFilter = new Filter({
				filters: aFilter,
				and: false // 'false'는 OR 조건을 의미
			});

			// filter binding
			var oTable = this.byId("dealNumberTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(oFilter);
		},
		onDialogAfterClose: function(oEvent) {
			this.sQuery.setValue("");
		},
		//////////////////////////////////////////////////////////////////거래번호 Value Help - E

		//////////////////////////////////////////////////////////////////종목ID Value Help - S   

		onSecurityHelp: function(oEvent) {
			this.onDialogOpen("HSecurity");
		},

		onSecurityOk: function(oEvent) {
			var SelectedData = this.onDialogOk("securityTable");
			var oData = SelectedData.Ranl;

			if (oData) {
				this.getView().byId("securityId").setValue(oData);
			}

			this.onDialogClose("HSecurity");

		},

		onSecurityCancel: function(oEvent) {
			this.onDialogClose("HSecurity");
		},

		onSecuritySearch: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				aFilter.push(new Filter("Ranl", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("Xallb", FilterOperator.Contains, sQuery));

			} else {
				aFilter.push(new Filter("Ranl", FilterOperator.Contains, sQuery));
			}

			var oFilter = new Filter({
				filters: aFilter,
				and: false // 'false'는 OR 조건을 의미
			});

			// filter binding
			var oList = this.getView().byId("securityTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(oFilter);

		},
		//////////////////////////////////////////////////////////////////종목ID Value Help - E	

		//////////////////////////////////////////////////////////////////상품유형 Value Help - S		
		onPTypeHelp: function(oEvent) {
			this.onDialogOpen("HPtype");
		},

		onPTypeOk: function(oEvent) {
			var SelectedData = this.onDialogOk("pTypTable");
			var oData = SelectedData.Gsart;

			if (oData) {
				this.getView().byId("productType").setValue(oData);
			}

			this.onDialogClose("HPtype");
		},

		onPTypeCancel: function(oEvent) {
			this.onDialogClose("HPtype");
		},

		onPTypSearch: function(oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Gsart", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("Ltx", FilterOperator.Contains, sQuery));
			} else {
				aFilter.push(new Filter("Gsart", FilterOperator.Contains, sQuery));
			}

			var oFilter = new Filter({
				filters: aFilter,
				and: false // 'false'는 OR 조건을 의미
			});

			// filter binding
			var oTable = this.byId("pTypTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(oFilter);
		},
		//////////////////////////////////////////////////////////////////상품유형 Value Help - E  

		//////////////////////////////////////////////////////////////////거래유형 Value Help - S
		onSfhaartHelp: function(oEvent) {
			this.onDialogOpen("SfhaartDialog");
		},

		onSfhhartOk: function(oEvent) {
			var SelectedData = this.onDialogOk("sfhaartTable");
			var oData = SelectedData.TTyp;

			if (oData) {
				this.getView().byId("sfhaart").setValue(oData);
			}

			this.onDialogClose("SfhaartDialog");
		},

		onSfhhartCancel: function(oEvent) {
			this.onDialogClose("SfhaartDialog");
		},

		onSfhaartSearch: function(oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Sgsart", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("Sfhaart", FilterOperator.Contains, sQuery));
			} else {
				aFilter.push(new Filter("Sfhaart", FilterOperator.Contains, sQuery));
			}

			var oFilter = new Filter({
				filters: aFilter,
				and: false // 'false'는 OR 조건을 의미
			});

			// filter binding
			var oTable = this.byId("sfhaartTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(oFilter);
		},
		//////////////////////////////////////////////////////////////////거래유형 Value Help - E     

		//////////////////////////////////////////////////////////////////당사계좌1 Value Help - S    
		onHbkidHelp: function(oEvent) {
			this.onDialogOpen("HHbkid");
		},

		onHbkidOk: function(oEvent) {
			var SelectedData = this.onDialogOk("hbkidTable");
			var oData = SelectedData.Hbkid;

			if (oData) {
				this.getView().byId("hbkid").setValue(oData);
			}

			this.onDialogClose("HHbkid");
		},

		onHbkidCancel: function(oEvent) {
			this.onDialogClose("HHbkid");
		},

		onHbkidSearch: function(oEvent) {
			// build filter array

			var aFilter = [];
			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				aFilter.push(new Filter("Hbkid", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.getView().byId("hbkidTable");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);

		},
		//////////////////////////////////////////////////////////////////당사계좌1 Value Help - E    

		//////////////////////////////////////////////////////////////////당사계좌2 Value Help - S
		onHktidHelp: function(oEvent) {
			this.onDialogOpen("HHktid");
		},

		onHktidOk: function(oEvent) {
			var SelectedData = this.onDialogOk("hktidTable");
			var oData = SelectedData.Hktid;

			if (oData) {
				this.getView().byId("hktid").setValue(oData);
			}

			this.onDialogClose("HHktid");
		},

		onHktidCancel: function(oEvent) {
			this.onDialogClose("HHktid");
		},

		onHktidSearch: function(oEvent) {
			// build filter array
			var sQuery = oEvent.getSource().getValue();
			var oFilter = new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Hktid", sap.ui.model.FilterOperator.Contains, sQuery)
				],
				and: false
			});

			var oBinding = sap.ui.getCore().byId("hktidTable").getBinding("items");
			oBinding.filter(oFilter, sap.ui.model.FilterType.Application);
		},
		//////////////////////////////////////////////////////////////////당사계좌2 Value Help - E    

		//////////////////////////////////////////////////////////////////계정구분 Value Help - S
		onPortDialog: function(oEvent) {
			this.onDialogOpen("portDialog");
		},

		onPortOk: function(oEvent) {
			var SelectedData = this.onDialogOk("portTable");
			var oData = SelectedData.Rportb;

			if (oData) {
				this.getView().byId("portfolio").setValue(oData);
			}
			this.onDialogClose("portDialog");
		},

		onPortCancel: function(oEvent) {
			this.onDialogClose("portDialog");
		},
		//////////////////////////////////////////////////////////////////계정구분 Value Help - E

		//////////////////////////////////////////////////////////////////운용역 Value Help - S
		onManagerHelp: function(oEvent) {
			this.onDialogOpen("managerDialog");
		},

		onManagerOk: function(oEvent) {
			var SelectedData = this.onDialogOk("managerTable");
			var oData = SelectedData.Manager;

			if (oData) {
				this.getView().byId("manager").setValue(oData);
			}
			this.onDialogClose("managerDialog");
		},

		onManagerCancle: function(oEvent) {
			this.onDialogClose("managerDialog");
		},
		//////////////////////////////////////////////////////////////////운용역 Value Help - E

		//////////////////////////////////////////////////////////////////거래처 Value Help - S
		onKontrhHelp: function(oEvent) {
			this.onDialogOpen("kontrhDialog");
		},
		onKontrhOk: function(oEvent) {
			var SelectedData = this.onDialogOk("kontrhTable");
			var oData = SelectedData.Partner;

			if (oData) {
				this.getView().byId("kontrh").setValue(oData);
			}
			this.onDialogClose("kontrhDialog");
		},
		onKontrhCancle: function(oEvent) {
			this.onDialogClose("kontrhDialog");
		},

		onKontrhSearch: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Partner", FilterOperator.Contains, sQuery));
				aFilter.push(new Filter("NameOrg1", FilterOperator.Contains, sQuery));
			} else {
				aFilter.push(new Filter("Partner", FilterOperator.Contains, sQuery));
			}

			var oFilter = new Filter({
				filters: aFilter,
				and: false // 'false'는 OR 조건을 의미
			});

			// filter binding
			var oTable = this.byId("kontrhTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(oFilter);
		},
		// //////////////////////////////////////////////////////////////////거래처 Value Help - E
		onSave: function(oEvent) {
			// Convert Date
			var tradingDate = this.getView().byId("tradingDate").getValue();
			var payMentDate = this.getView().byId("payMentDate").getValue();

			var tradingDateTimestamp = this.convertDateToTimestamp(tradingDate);
			var payMentDateTimestamp = this.convertDateToTimestamp(payMentDate);
			// var that = this;

			// Entry Object 
			var oEntry = {
				CompanyCode: this.getView().byId("companyCode").getValue(), // 회사코드
				SecurityId: this.getView().byId("securityId").getValue(), // 종목ID
				ProductType: this.getView().byId("productType").getValue(), // 상품유형
				Sfhaart: this.getView().byId("sfhaart").getValue(), // 거래유형
				DealNumber: this.getView().byId("dealNumber").getValue(), // 거래번호

				Status: this.getView().byId("status").getValue(), // 상태
				//Zdatasrc: this.getView().byId("zdatasrc").getValue(),				// 데이터구분
				//ExpId: this.getView().byid("expId").getValue(), 						// 구,포지션ID

				TradingDate: tradingDateTimestamp, // 거래일
				PaymentDate: payMentDateTimestamp, // 결제일
				NominalCurr: "KRW", // 통화

				Xbnwhr: this.getView().byId("nominalAmt").getValue(), // 액면
				Rrate: this.getView().byId("rrate").getValue(), // 수익률
				Zprice1: this.getView().byId("zprice1").getValue(), // 계산단가
				Zprice4: this.getView().byId("zprice4").getValue(), // 단가조정
				//Zprice3: this.getView().byId("zprice3").getValue(),					// 적용단가
				Xbzbetr: this.getView().byId("xbzbetr").getValue(), // 시가

				Xzamt18: this.getView().byId("tradeAmt").getValue(), // 매매금액
				SettleAmt: this.getView().byId("settleAmt").getValue(), // 정산금액
				IninAmt: this.getView().byId("ininAmt").getValue(), // 경과이자

				Kontrh: this.getView().byId("kontrh").getValue(), // 거래처
				Hbkid: this.getView().byId("hbkid").getValue(), // 당사계좌	
				Hktid: this.getView().byId("hktid").getValue(), // 당사계좌2
				Sglzb: this.getView().byId("sglzb").getValue(), // 예탁처

				Portfolio: this.getView().byId("portfolio").getValue(), // 포트폴리오
				AccountGroup: this.getView().byId("accountGroup").getValue(), // 운용펀드
				Manager: this.getView().byId("manager").getValue(), // 운용역
				OperPart: this.getView().byId("operPart").getValue(), // 운용부서
				SecurityAccount: this.getView().byId("securityAccount").getValue(), // 유가증권계정
				BuyDate: this.getView().byId("buyDate").getValue(), // 매입결제일

				StBdGbn: this.getView().byId("stBdGbn").getValue(), // 지분/채무구분
				//BizModel: this.getView().byId("bizModel").getValue(),				// 사업모형평가
				//SppiTest: this.getView().byId("sppiTest").getValue(),				// SPPI TEST
				ComValClass: this.getView().byId("comValClass").getValue(), // 보유목적
				FvociYn: this.getView().byId("fvociYn").getValue(), // FVOCI 지정여부
				FvociRsn: this.getView().byId("fvociRsn").getValue(), // FVOCI 지정사유

				XsecClass: this.getView().byId("xsecClass").getValue(), // 유가증권분류
				XbondClass: this.getView().byId("xbondClass").getValue(), // 채권분류
				Itcd: this.getView().byId("itcd").getValue(), // 이자지급방법
				IssueDate: this.getView().byId("issueDate").getValue(), // 발행일
				Cupr: this.getView().byId("cupr").getValue(), // 표면이자율
				Ipyohal01: this.getView().byId("ipyohal01").getValue(), // 할인율
				Szbmeth: this.getView().byId("szbmeth").getValue(), // 일수계산방법
				Ittm: this.getView().byId("ittm").getValue(), // 이자계산주기
				Eddt: this.getView().byId("eddt").getValue(), // 만기일
				Zfrate1: this.getView().byId("zfrate1").getValue(), // FRN RATE1
				Zfrate2: this.getView().byId("zfrate2").getValue(), // FRN RATE2
				//Frnmt: this.getView().byId("frnmt").getValue(),						// FRN계산식
				//Frnm: this.getView().byId("frnm").getValue(),						// FRN참조금리
				Hidt: this.getView().byId("hidt").getValue(), // 최초이자지급일
				Isin: this.getView().byId("isin").getValue(), // 표준코드
				Xrfmd: this.getView().byId("xrfmd").getValue() // 상환방법
			};
			// Create the data
			oMainModel.create("/Z_BDTRANSet", oEntry, {
				success: function(oData, response) {
					alert("성공");

				},
				error: function(oError) {
					alert("실패");
				},
				async: false
			});

		},

		onDisplayBungae: function() {
			this.onDialogOpen("JournalDial");

		},
		onDisplaytCancel: function(oEvent) {
			this.onDialogClose("JournalDial");
		},
		onDelete: function() {
			// Get values from the view
			var tradingDate = this.getView().byId("tradingDate").getValue();
			var payMentDate = this.getView().byId("payMentDate").getValue();

			// Convert dates to timestamps
			var tradingDateTimestamp = this.convertDateToTimestamp(tradingDate);
			var payMentDateTimestamp = this.convertDateToTimestamp(payMentDate);
			// var that = this;

			// Construct the entry object
			var oEntry = {
				CompanyCode: this.getView().byId("companyCode").getValue(),
				SecurityId: this.getView().byId("securityId").getValue(),
				DealNumber: this.getView().byId("dealNumber").getValue(),
				Status : this.getView().byId("status").getValue(),
					// Sfhaart: this.getView().byId("sfhaart").getValue(),
					// ProductType: this.getView().byId("productType").getValue(),
					// SecurityAccount: this.getView().byId("securityAccount").getValue(),
					// Rrate: this.getView().byId("rrate").getValue(),
					// NominalAmt: this.getView().byId("nominalAmt").getValue(),
					// NominalCurr: "KRW",
					TradingDate: tradingDateTimestamp,
					PaymentDate: payMentDateTimestamp
					// Zprice3: this.getView().byId("zprice2").getValue(),
					// Xbnwhr: this.getView().byId("nominalAmt").getValue()
					// Rrate: this.getView().byId("rrate").getValue()
			};
			console.log(oEntry);

			// Create the data
			oMainModel.create("/zDeleteSet", oEntry, {
				success: function(oData, response) {
					alert("성공");

				},
				error: function(oError) {
					alert("실패");
				},
				async: false
			});
		},
		
		onSettle: function(oEvent){
			
				var payMentDate = this.getView().byId("payMentDate").getValue();
				var payMentDateTimestamp = this.convertDateToTimestamp(payMentDate);			
				var that = this;
			var oEntry = {
				CompanyCode: this.getView().byId("companyCode").getValue(),
				DealNumber: this.getView().byId("dealNumber").getValue(),
				Status: this.getView().byId("status").getValue(),
				PaymentDate: payMentDateTimestamp
			};
			
			console.log(oEntry);
			
			oMainModel.create("/ZsettleSet", oEntry, {
				success: function(oData, response){
					alert("성공");
					that.onSelect();
				},
				error: function(oError){
					alert("실패");
				},
				async: false
			});
		}

		// onBungae: function(oEvent){
		// 	var sUr = "https://noams41.noaats.com:5245/sap/bc/ui2/flp?sap-client=100&sap-language=KO#TreasuryPosition-displayPostingLineItem";
		// 	window.open(sUr, "_blank");
		// }

	});
});