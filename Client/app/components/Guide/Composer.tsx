import React from "react";
import PageHeader from "../General/PageHeader";
import Image from "next/image";
type Props = {};

const Composer = (props: Props) => {
  return (
    <div className="Composer">
      <div className="NoteArea">
        <div className="sticky top-0 z-[40]">
          <PageHeader title="Dashboard" href="/" message="User Guide" />
        </div>
        <div className="flex justify-center w-full items-center overflow-auto">
          <div className="p-4 leading-7 font-[Arial] font-lessbold tracking-wider w-full lg:w-[50%] flex flex-col items-center overflow-hidden">
            <h1 id="getting-started" className="text-[30px]">
              Introduction
            </h1>
            <p className=" text-[17px] mb-20">
              This app is designed to help you memorize information more
              effectively. While it isn’t focused on quizzing or testing, the
              goal is to support memory retention in a structured way. As the
              approach develops, its effectiveness will continue to be refined.
              I built this app, because I personally find it challenging to
              remember terminology and information in general.
            </p>
            <h2 className="text-[25px]">
              So how does this work? The linking system
            </h2>
            <p className=" text-[17px] mb-5">
              At the heart of this app lies a powerful system for connecting
              your notes, allowing you to build a web of knowledge that mirrors
              how your brain naturally associates ideas. This is achieved
              through unique <strong>Tags</strong> and the <strong>Link</strong>{" "}
              feature within each Note(or Card).
            </p>
            <p>
              As a reminder, each Note you create has four key parts: A{" "}
              <strong>Question</strong>, an <strong>Answer</strong>, a{" "}
              <u>Unique</u> <strong>Tag</strong>, and a <strong>Link</strong>{" "}
              section. While the Question and Answer hold the core information,
              the <strong>Tag</strong> and <strong>Link</strong> are what unlock
              the app's unique potential.
            </p>
            <p>Take a look at the example below</p>
            <Image alt="" width={400} height={400} src={"/example.png"}></Image>
            <p>
              In this example, Note 2's link section contains the Tag "A" from
              Note1. This creates a connection:{" "}
              <strong>
                Note 1 becomes the parent, and Note 2 is its child
              </strong>
              . A parent note can have many child notes linked to it, forming a
              branching structure of related information.
            </p>
            <p className="text-[17px] mt-5">
              Now, the real power emerges when you start linking multiple cards
              together. This allows you to create intricate relationships
              between different pieces of information. Consider the scenario
              below.
            </p>
            <Image
              alt=""
              width={800}
              height={400}
              className="w-100 h-100"
              src={"/example2.png"}
            ></Image>
            <p className="mb-20">
              Here <strong>Note 2, 3 and 4</strong> are all linked to the parent
              <strong> Note 1</strong>. As you can see the possibilities for
              creating connections are vast. This system allows you to move
              beyond isolated facts and build a network of understanding that
              reflects the complex way your brain stores and retrieves
              information.
            </p>
            <h2 className="text-[25px]">Why this linking system?</h2>
            <p className="mb-5">
              Our brains don't store information in isolation; they form neural
              connections, creating pathways between related concepts. This
              app's linking system aims to simulate this process by conciously
              creating these links, you are essentially buidling your own neural
              pathways within your knowledge base.
            </p>
            <p>
              While the direct scientific proof of this speicifc linking
              method's impact on long-term retention requires further research,
              the act of actively creating connections between pieces of
              information is a well-established congnitive strategy for
              enhancing understanding and recall. By conciously building these
              links, you are engaging in a process that can help you:
            </p>
            <ul className="list-disc pl-5 mb-5 mt-5">
              <li>
                <strong>See Relationships:</strong> Explicity connecting notes
                can make the relationships between different concepts clearer.
              </li>
              <li>
                <strong>Improve Comprehension:</strong> Understanding how
                different facts and ideas relate to each other can lead to
                deeper Comprehension.
              </li>
              <li>
                <strong>Facilitate Retrievel:</strong> Creating pathways between
                information may improve yur ability to retrieve related concepts
                when you recall one of them.
              </li>
            </ul>
            <p className="mb-20">
              By strategically using unique Tags and Link feature, you're not
              just taking notes; you're actively structuring your knowledge in a
              way that mirrors the interconnected nature of information and
              potentially enhances your learning process.
            </p>
            <h2 className="text-[25px]">The Play mode</h2>
            <p className="text-[17x] mb-5">
              The Play mode is your built-in quizzing system, designed to help
              you actively practice and reinforce the connections you've created
              between your notes. Think of it as a dynamic way to test your
              understanding of the linked information within your Notebooks
              (which we als somtimes refer to as decks).
            </p>
            <p className="w-full">Here's how it works</p>

            <ul className="list-disc pl-5">
              <li>
                <strong>Selecting a Deck: </strong> To begin, you'll choose a
                Notebook(or Deck) that you want to practice.
              </li>
              <li>
                <strong>Starting Card: </strong>
                The Play mode will start with the very first card you created
                within that selected Notebook. This card is the initial "parent"
                in your linked structure.
              </li>
              <li>
                <strong>Dynamic Card Selection: </strong> After the starting
                card, the app will intelligently select the next "child" card to
                present you. This selection is based on the current score of
                each child card linked to the previous one.
                <ul className="list-decimal pl-6">
                  <li>
                    <strong>Prioritizing Weak Areas: </strong> The card with the
                    lowest score among the linked children is prioritized,
                    helping you focus on areas where you might need more
                    practice.
                  </li>
                  <li>
                    <strong>Random Selection:</strong> If multiple child cards
                    have the same lowest score, one will be chosen at random.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Building the Play Deck:</strong> This process continues,
                moving from one card to its linked children, dynamically forming
                a sequence of questions - your "Play Deck".
              </li>
              <li>
                <strong>Quzzing and Scoring:</strong> You'll be prsented with
                the "Question" of each card in the play Deck. After you select
                one of the options. The app will reveal the "Answer". If you
                answer correctly the score of that card will increase otherwise
                decrease.
              </li>
              <li>
                <strong>Updating Scores:</strong> Once you've gone through the
                entire Play Deck, the scores for all the cards you encounterd
                will be updated in your system.
              </li>
              <li>
                <strong>Adaptive learning: </strong> The beauty of the Play mode
                is that it adapts to your performance. Cards you struggle with
                will appear more frequently in future Play sessions, while cards
                you know well will appear less often. This ensures that your
                practice is targetted and efficient.
              </li>
            </ul>
            <p className="mt-5 mb-20">
              {" "}
              By using the Play mode regularly, you can actively engage with the
              linked structure of your notes, reinforce your understanding of
              the relationships you've created, and track your progress over
              time.
            </p>
            <h2 className="text-[25px]">Rules</h2>
            <p className="w-full">
              There are certain rules that need to be followed
            </p>
            <ul className="list-disc pl-5">
              <li>
                From the parent card, every chain of child cards must be atleast
                4, for a valid playdeck to form.
              </li>
              <li>
                Tags and links are case sensitive, even an extra whitespace
                makes it a different tag or link.
              </li>
              <li>
                Tags are unique, meaning no two notes can have the same tag even
                if they are in different notebooks.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
