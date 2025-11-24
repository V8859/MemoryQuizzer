import Link from "next/link";
import React from "react";

type Props = {
  title: string;
  href: string;
  message?: string | React.ReactNode;
  userName?: string | null | undefined;
  title2?: string;
  href2?: string;
  children?: React.ReactNode[];
};

const PageHeader = (props: Props) => {
  return (
    <div>
      <div className="w-full flex flex-col pl-[13px] basicHeaderColor rounded">
        <div className="w-full flex">
          <Link
            href={props.href}
            className="text-[33px] w-fit text-center flex justify-self-center font-black rounded"
          >
            {props.title}
          </Link>

          {props.title2 && props.href2 ? (
            <div className="h-[100%] bg-white py-4 mx-2 my-2 w-[1px]"></div>
          ) : (
            ""
          )}
          {props.title2 && props.href2 ? (
            <Link
              href={props.href2}
              className="text-[33px] w-fit text-center flex justify-self-center font-black rounded"
            >
              {props.title2}
            </Link>
          ) : (
            ""
          )}
        </div>

        <div className="w-full flex items-end justify-between">

          <div className="w-fit items-center justify-center WelcomeMessage flex gap-2 font-sans pt-2 px-4 rounded-t-xl">
            <h1 className="text-[20px]">
              {props.children?.[0] ? props.children[0] : props.message}
            </h1>
            {props.userName ? (
              <h1
                className={
                  "text-center font-extralight text-[20px] flex items-center justify-center"
                }
              >{`${props.userName?.split(" ")[0]}`}</h1>
            ) : (
              ""
            )}
          </div>
          <div>
            {props.children?.[1]}
          </div>
        </div>


      </div>
    </div>
  );
};

export default PageHeader;
