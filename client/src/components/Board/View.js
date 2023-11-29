import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
// import Swal from 'sweetalert2'

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            before_swtcode: props.match.params.num,
            selectedFile: null,           
        }
    }
    
    componentDidMount () {
        
        if(this.state.before_swtcode == 'register'){
            $('.modifyclass').hide()
        }else{
            this.callSwToolInfoApi()
            $('.saveclass').hide()
        }
    }

    /*
    callSwToolListApi = async () => {
        axios.get('http://localhost:8080/api/read?num=3', {
        })
        .then( response => {
            try {
                this.setState({ responseSwtoolList: response });
                this.setState({ append_SwtoolList: this.SwToolListAppend() });
            } catch (error) {
                alert('1. 작업중 오류가 발생하였습니다.');
            }
        })
        .catch( error => {alert('2. 작업중 오류가 발생하였습니다.');return false;} );
    }
    */

    callSwToolInfoApi = async () => {
        axios.post('http://localhost:8080/api/read', {
            num: this.state.before_swtcode,
        })
        .then( response => {
            try {
                var data = response.data
                $('#is_Swt_toolname').val(data.title)
                // $('#is_Swt_demo_site').val(data.swt_demo_site)
                // $('#is_Giturl').val(data.swt_github_url)
                $('#is_Comments').val(data.content)
                //$('#is_Swt_function').val(data.swt_function)
                /*
                var manualName = data.swt_manual_path.replace('/swmanual/','')
                var fileName = data.swt_big_imgpath.replace('/image/','')
                // var fileName2 = data.swt_imagepath.replace('/image/','')
                $('#upload_img').prepend('<img id="uploadimg" src="'+data.swt_big_imgpath+'"/>')
                // $('#upload_img2').prepend('<img id="uploadimg2" src="'+data.swt_imagepath+'"/>')

                $('#imagefile').val(fileName)
                // $('#imagefile2').val(fileName2)
                $('#manualfile').val(manualName)

                if($('#uploadimg').attr('src').indexOf("null") > -1){
                    $('#uploadimg').hide()
                }
                if($('#uploadimg2').attr('src').indexOf("null") > -1){
                    $('#uploadimg2').hide()
                }
                */                
            } catch (error) {
                alert('3. 작업중 오류가 발생하였습니다.')
            }
        })
        .catch( error => {alert('4. 작업중 오류가 발생하였습니다.');return false;} );
    }

    /*
    SwToolListAppend = () => {
        let result = []
        var SwToolList = this.state.responseSwtoolList.data
        
        for(let i=0; i<SwToolList.length; i++){
            var data = SwToolList[i]

           

            result.push(
                <tr class="hidden_type">
                    <td>{data.title}</td>
                    <td>{data.content}</td>
                    
                </tr>
            )
        }
        return result
    }
    */

   

    render () {
        // let [like, setLike] = useState(0);
        return (
            <section class="sub_wrap">
                <article class="s_cnt mp_pro_li ct1">
                    <div class="li_top">
                        <h2 class="s_tit1">글보기</h2>
                    </div>
                    <div class="bo_w re1_wrap re1_wrap_writer">
                        <form name="frm" id="frm" action="" onsubmit="" method="post" >
                            <input id="is_Swtcode" type="hidden" name="is_Swtcode" />
                            <input id="is_Email" type="hidden" name="is_Email" value="guest" />
                            <input id="is_beforeSwtcode" type="hidden" name="is_beforeSwtcode" value={this.state.before_swtcode} />
                            <article class="res_w">
                                
                                <div class="tb_outline">
                                    <table class="table_ty1">
                                        <tr>
                                            <th>
                                                <label for="is_Swt_toolname">제목<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <input type="text" name="title" id="is_Swt_toolname" class="" />
                                            </td>
                                        </tr>
                                        
                                        <tr>
                                            <th>
                                                <label for="is_Comments">내용<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <textarea name="content" id="is_Comments" rows="" cols="" ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_re">좋아요<span class="red"></span></label>
                                            </th>
                                            <td>
                                                <img src={require("../../img/layout/carlogo001.png")} height="30px" width="30px" alt=""/>
                                                {/* <span onClick={ ()=> { setLike(like + 1) } }><img src={require("../../img/layout/carlogo001.png")} height="30px" width="30px" alt=""/></span> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <label for="is_re">댓글<span class="red"></span></label>
                                            </th>
                                            <td class="fileBox fileBox_w1">
                                                <input type="text" name="re" id="is_re" className="fileName fileName1" />
                                                <label for="uploadBtn1" class="btn_file" >등록</label>
                                            </td>
                                        </tr>
                                       
                                    </table>
                                    <div class="btn_confirm mt20" style={{"margin-bottom": "44px"}}>
                                        <Link to={'/NBoardList'} className="bt_ty bt_ty1 cancel_ty1">목록보기</Link>
                                        <Link to={'/ContentView2/register'} className="bt_ty bt_ty1 cancel_ty1">수정하기</Link>
                                        
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

export default View;