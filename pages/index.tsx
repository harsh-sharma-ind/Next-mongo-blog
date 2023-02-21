import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import {useState} from 'react';
import Layout from '../components/Layout';

type Props = {
  posts: [Post]
}

type Post = {
  _id: String;
  title: String;
  content: String;
}

export async function getServerSideProps() {
  try {
    let response = await fetch('http://localhost:3000/api/getPosts');
    let posts = await response.json();

    return {
      props: { posts: JSON.parse(JSON.stringify(posts)) },
    };
  } catch (e) {
    console.error(e);
  }
}

export default function Posts(props: Props) {
  const [posts, setPosts] = useState < [Post] > (props.posts);

  const handleDeletePost = async (postId: string) => {
    try {
      let response = await fetch(
        "http://localhost:3000/api/deletePost?id=" + postId,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      response = await response.json();
      window.location.reload();
    } catch (error) {
      console.log("An error occurred while deleting ", error);
    }
  };

  return (
    <Layout>
      <div className="posts-body">
        <h1 className="posts-body-heading">Top 20 Added Posts</h1>
        {posts.length > 0 ? (
          <ul className="posts-list">
            {posts.map((post, index) => {
              return (
                <li key={index} className="post-item">
                  <div className="post-item-details">
                    <h2>{post.title}</h2>
  
                    <p>{post.content}</p>
                  </div>
                  <div className="post-item-actions">
                    <a href={`/posts/${post._id}`}>Edit</a>
                    <button className="submit_btn" onClick={() => handleDeletePost(post._id as string)}>
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <h2 className="posts-body-heading">Ooops! No posts added so far</h2>
        )}
      </div>
      <style jsx>
        {`

          @import url('https://fonts.googleapis.com/css2?family=Mynerve&display=swap');
          .posts-body {
            width: 400px;
            margin: 10px auto;
            font-family: 'Mynerve', cursive;
            
          }
          .posts-body-heading {
            font-family: 'Mynerve', cursive;
          }
          .posts-list {
            list-style-type: none;
            display: block;
          }
          .post-item {
            width: 100%;
            padding: 10px;
            border: 1px solid grey;
            border-radius: 10px;
          }
          .post-item-actions {
            display: flex;
            justify-content: space-between;
          }
          .post-item-actions a {
            text-decoration: none;
          }

          .submit_btn{
            border: none;
            color: white;
            background-color: black;
            font-family: 'Mynerve', cursive;
            border-radius : 20px;
          }
        `}
      </style>
    </Layout>
  );
}
