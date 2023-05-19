import ChatItem from "./ChatItem";
import {useGetConversationsQuery} from "../../features/conversations/conversationsApi";
import {useSelector} from "react-redux";
import Error from "../ui/Error";

export default function ChatItems() {
    const {user} = useSelector(state => state.auth) || {};
    const {email} = user || {};
    const {data: conversations, isLoading, isError, error} = useGetConversationsQuery(email);

    let content = null;

    if(isLoading){
        content = <li className="m-2 text-center">Loading...</li>
    }else if(!isLoading && isError){
        content = <li className="m-2 text-center">
            <Error message={error.data}/>
        </li>
    }else if(!isLoading && !isError && conversations?.length === 0){
        content = <li className="m-2 text-center">No conversations found :)</li>
    }else if(!isLoading && !isError && conversations?.length > 0){
        content = conversations.map(conversation => {
            return   <li key={conversation?.id} className="m-2 text-center">
                <ChatItem
                avatar="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
                name="Saad Hasan"
                lastMessage="bye"
                lastTime="25 minutes"
            />
                </li>
        })
    }

    return (
        <ul>
            {content}
        </ul>
    );
}
