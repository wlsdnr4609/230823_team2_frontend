import React, { Component } from 'react';
import axios from "axios";
import Swal from 'sweetalert2';
import $ from 'jquery';

class CarRegister extends Component {
    constructor (props) {
        super(props);
        this.state = {
        }
    }

    submitClick = async (type, e) => {
        if(this.fnValidate()){
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
            Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";
            
           

            axios.post('http://localhost:8080/api/register', Json_form, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
            .then( response => {
                if( response.data == "succ"){
                    if(type == 'save'){
                        this.sweetalertSucc('등록이 완료되었습니다.', false)
                    }else if(type == "modify"){
                        this.sweetalertSucc('수정이 완료되었습니다.', false)
                    }
                    setTimeout(function() {
                        this.props.history.push('/NBoardList');
                        }.bind(this),1500
                    );
                }else{
                    alert('1. 작업중 오류가 발생하였습니다.')
                }  
            })
            .catch( error => {alert('2. 작업중 오류가 발생하였습니다.');return false;} )
            
        }
    };

    
    sweetalert = (title, contents, icon, confirmButtonText) => {
        Swal.fire({
            title: title,
            text: contents,
            icon: icon,
            confirmButtonText: confirmButtonText
          })
    }


    
    render () {
        return (
            <div>
                <section className="sub_wrap" >
                    <article className="s_cnt re_1 ct1">
                        <div className="li_top">
                            <h2 className="s_tit1">차량정보등록</h2>
                            <form method="post" name="frm">
                                <div className="re1_wrap">
                                    <div className="re_cnt ct2">
                                        <table className="table_ty1">
                                            <tr className="re_email">
                                                <th>브랜드</th>
                                                <td>
                                                    <input id="brand_val" type="text" name="is_Userbrand"
                                                    placeholder="브랜드명을 입력해주세요." onKeyPress={this.emailKeyPress}/>
                                                    
                                                    <select id="email2_val" name="brandName" className="select_ty1">
                                                            <option value="">선택하세요</option>
                                                            <option value='naver.com'>현대</option>
                                                            <option value='hanmail.net'>기아</option>
                                                            <option value='nate.com'>쉐보레</option>
                                                            <option value='hotmail.com'>테슬라</option>
                                                            <option value='gmail.com'>벤츠</option>
                                                            <option value='yahoo.co.kr'>BMW</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            
                                            <tr>
                                                <th>모델명</th>
                                                <td>
                                                    <input id="carName_val" type="text" name="is_UserCarname"
                                                    placeholder="모델명을 입력해주세요." onKeyPress={this.nameKeyPress}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>번호</th>
                                                <td>
                                                    <input id="carNum_val" type="text" name="is_carNum"
                                                    placeholder="예) 123가 4567." />
                                                </td>
                                            </tr>
                                            
                                            <tr className="tr_tel">
                                                <th>충전방식</th>
                                                <td>
                                                    <select id="phone1_val" name="is_Userphone1" className="select_ty1">
                                                        <option value="">선택</option>
                                                        <option value="010">DC차데모</option>
                                                        <option value="011">AC3상</option>
                                                        <option value="016">DC콤보</option>
                                                        <option value="017">AC단상</option>
                                                        <option value="018">AC3상 7핀</option>
                                                        <option value="019">019</option>
                                                    </select>
                                                    
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div className="btn_confirm">
                                    <div className="bt_ty bt_ty2 submit_ty1" 
                                    onClick={(e) => this.submitClick('signup', e)}>확인</div>
                                </div>
                            </form>
                        </div>
                    </article>
                </section>
            </div>
        );
    }
}

export default CarRegister;