import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import $, { data } from 'jquery';
import Swal from 'sweetalert2'
import cookie from 'react-cookies';

class FBoardView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            selectedFile: null,
            niname: '',
            niname2: '',
            btype: '',
            mid: '',
            email: '',
        }
    }

    componentDidMount () {
        var cookie_usernm = cookie.load('niname')
        this.setState({niname2 : cookie_usernm})
        var cookie_userid = cookie.load('email')
        this.setState({email : cookie_userid})
    }

    // callSwToolInfoApi = async () => {
    //     axios.post('/api/member/readMember', {
    //         email: await this.state.email,
    //     })
    //     .then( response => {
    //         try {
    //             var data = response.data
    //             this.setState({niname: data.niname})
    //             this.setState({mid: data.mid})
    //             $('#is_Swt_toolname').val(data.title)
    //             $('#is_Comments').val(data.cont)
    //             var fileName = data.swt_big_imgpath.replace('/image/','')
    //             $('#upload_img').prepend('<img id="uploadimg" src="'+data.swt_big_imgpath+'"/>')

    //             $('#imagefile').val(fileName)

    //             if($('#uploadimg').attr('src').indexOf("null") > -1){
    //                 $('#uploadimg').hide()
    //             }
    //         } catch (error) {
    //             alert('작업중 오류가 발생하였습니다.')
    //         }
    //     })
    //     .catch( error => {alert('작업중 오류가 발생하였습니다.');return false;} );
    // }

    submitClick = async (type, e) => {

        this.Swt_toolname_checker = $('#is_Swt_toolname').val();
        this.Comments_checker = $('#is_Comments').val();
        
        this.fnValidate = (e) => {
            if(this.Swt_toolname_checker === '') {
                $('#is_Swt_toolname').addClass('border_validate_err');
                alert('제목을 다시 확인해주세요.')
                return false;
            }
            $('#is_Swt_toolname').removeClass('border_validate_err');
            
            if(this.Comments_checker === '') {
                $('#is_Comments').addClass('border_validate_err');
                alert('내용을 다시 확인해주세요.')
                return false;
            }
            $('#is_Comments').removeClass('border_validate_err');
           
            return true;
        }

        if(this.fnValidate()){
            var jsonstr = $("form[name='frm']").serialize();
            jsonstr = decodeURIComponent(jsonstr);
            var Json_form = JSON.stringify(jsonstr).replace(/\"/gi,'')
            Json_form = "{\"" +Json_form.replace(/\&/g,'\",\"').replace(/=/gi,'\":"')+"\"}";
            // alert(Json_form);
            // this.setState({btype : data.btype})
            // alert(data.btype)
            axios.post('/api/write', Json_form, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
            .then( response => {
                if( response.data == "succ"){
                    if(type == 'save'){
                        this.sweetalertSucc('등록이 완료되었습니다.', false)
                    setTimeout(function() {
                        this.props.history.push('/FBoardList');
                        }.bind(this),1500
                    );
                }else{
                    alert('1. 작업중 오류가 발생하였습니다.')
                }  
            }
            })
            .catch( error => {alert('2. 작업중 오류가 발생하였습니다.');return false;} )
        }
    };

    sweetalertSucc = (title, showConfirmButton) => {
        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: title,
            showConfirmButton: showConfirmButton,
            timer: 1000
        })
    }

    handleFileInput(type, e){
        if(type =='file'){
            $('#imagefile').val(e.target.name)
        }
        this.setState({
          selectedFile : e.target,
        })
        setTimeout(function() {
            if(type =='manual'){
                this.handlePostMenual()
            }else{
                this.handlePostImage(type)
            }
        }.bind(this),1
        );
    }

    handlePostImage(type){
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        return axios.post("/api/upload", formData).then(res => {
            if(type =='file'){
                this.setState({fileName : res.data.filename})
                $('#is_MainImg').remove()
                $('#uploadimg').remove()
                $('#upload_img').prepend('<img id="uploadimg" src="/image/'
                +this.state.fileName+'"/>')
                $('#upload_img').prepend('<input id="is_MainImg" type="hidden"'
                +'name="is_MainImg" value="/image/'+this.state.fileName+'"}/>')
            }
        }).catch(error => {
            alert('8. 작업중 오류가 발생하였습니다.')            
        })
    }

    render () {
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">글쓰기</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <input id="is_Swtcode" type="hidden" name="btype" value="F" />
                            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                            <input id="is_Email" type="hidden" name="niname" value={this.state.niname2} />
                            <input id="is_beforeSwtcode" type="hidden" name="mid" value={this.state.mid} />
                            <article class="res_w">
                                <p class="ment" style={{"text-align": "right"}}>
                                    <span class="red">(*)</span>표시는 필수입력사항 입니다.
                                </p>
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr className="tr_tel">
                                             <th>게시판 종류</th>
                                                <td>
                                                <p  id="is_niname" name="btype" class=""  readonly="readonly">자유게시판</p>
                                                    {/* <select id="btype_val" name="btype" className="select_ty1">
                                                        <option value="">선택</option>
                                                        <option value="N">공지사항</option>
                                                        <option value="F">자유게시판</option>
                                                        <option value="R">리뷰</option>
                                                        <option value="Q">문의</option>
                                                    </select> */}
                                                    
                                                </td>
                                            </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Swt_niname">작성자</label>
                                            </th>
                                            <td>
                                                {/* <input type="text"  id="is_Swt_toolname" name="niname" class="" value={this.state.niname2} readonly="readonly"/> */}
                                                <p  id="is_niname" name="niname" class=""  readonly="readonly">{this.state.niname2}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Swt_toolname">제목<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <input type="text"  id="is_Swt_toolname" name="title" class="" />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_Comments">내용<span class="red">(*)</span></label>
                                            </th>
                                            <td>
                                                <textarea  id="is_Comments" name="cont" rows="" cols=""></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                            첨부파일
                                            </th>
                                            <td className="fileBox fileBox1">
                                                <label htmlFor='imageSelect' className="btn_file">파일선택</label>
                                                <input type="text" id="imagefile" className="fileName fileName1"
                                                readOnly="readonly" placeholder="선택된 파일 없음"/>
                                                
                                                <input type="file" id="imageSelect" className="uploadBtn uploadBtn1"
                                                onChange={e => this.handleFileInput('file',e)}/>
                                                <div id="upload_img">
                                                </div>
                                            </td>
                                        </tr>
                                       
                                    </table>
                                    <div class="btn_confirm mt20" style={{"margin-bottom": "44px"}}>
                                        <Link to={'/FBoardList'} className="bt_ty bt_ty1 cancel_ty1">취소</Link>
                                        <a href="javascript:" className="bt_ty bt_ty2 submit_ty1 saveclass" 
                                        onClick={(e) => this.submitClick('save', e)}>저장</a>
                                    </div>
                                </div>
                            </article>
                        </form>	
                    </div> 
                </article>
            </section>
        );
    }
}

export default FBoardView;