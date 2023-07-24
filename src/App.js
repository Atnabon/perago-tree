import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector} from "react-redux";

import { TreeView, TreeItem } from "./components/TreeView";
import EditDialog from "./components/EditDialog";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Position from "./components/Position";



export default function App() {
  const [positions, setPositions] = useState([]);
  const [positionTree, setPositionTree] = useState([]);
  const [positionsDeleted, setPositionsDeleted] = useState([]);
  const [newPositions] = useState([]);
  const [positionChanged, setPositionChanged] = useState(false);

  let selectedPositionId = useSelector(
    (state) => state.position.selectedPositionId
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/positions")
      .then((response) => {
        const organizedTree = organizePositionsIntoTree(response.data);
        setPositions(organizedTree);
        setPositionTree(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [positionChanged, selectedPositionId]);

  const organizePositionsIntoTree = (positions) => {
    const parentNamesWithChildren = new Set();

    // Map to quickly find positions by their name
    const positionMap = new Map();
    positions.forEach((position) => {
      positionMap.set(position.name, position);
      if (position.parentName !== "NONE") {
        parentNamesWithChildren.add(position.parentName);
      }
    });

    // Build the trees
    const trees = positions.filter((position) => {
      if (position.parentName === "NONE") {
        return true; // Standalone tree
      } else {
        const parent = positionMap.get(position.parentName);
        if (parent && parentNamesWithChildren.has(parent.name)) {
          // Subtree
          if (!parent.subtrees) {
            parent.subtrees = [];
          }
          parent.subtrees.push(position);
          return false;
        } else {
          return true; // Standalone tree
        }
      }
    });

    return trees;
  };

  const renderSubtrees = (trees) => {
    return trees.map((tree) => {
      if (!tree.subtrees || tree.subtrees.length === 0) {
        return (
          <TreeItem
            key={tree.id}
            id={tree.id}
            title={tree.name}
            onDeletePosition={handleDeletePosition}
          />
        );
      }

      // If the tree has subtrees, recursively call renderSubtrees
      // and remove the deleted position from the subtrees
      const updatedSubtrees = tree.subtrees.filter(
        (subtree) =>
          !positionsDeleted.includes(subtree.id) &&
          !newPositions.includes(subtree.id)
      );

      return (
        <TreeItem
          key={tree.id}
          id={tree.id}
          title={tree.name}
          onDeletePosition={handleDeletePosition}
        >
          {renderSubtrees(updatedSubtrees)}
        </TreeItem>
      );
    });
  };

  const handleDeletePosition = (id) => {
    // Update the state by adding the deleted position ID to positionsDeleted
    setPositionsDeleted((prevPositionsDeleted) => [
      ...prevPositionsDeleted,
      id,
    ]);
  };

  const addNewPosition = (newPosition) => {
    setPositions([...positions, newPosition]);
  };

  return (
    <>
      <Header />
      <br />
      <div className="mt-5 mb-16 flex flex-col min-h-screen">
        <div className="lg:px-10">
          <TreeView
            setPositionChanged={setPositionChanged}
            className="py-5 md:py-10"
          >
            {renderSubtrees(positions)}
          </TreeView>
        </div>
        <div className="mb-16">
          <Position
            addNewPosition={addNewPosition}
            positions={positionTree}
            setPositionChanged={setPositionChanged}
          />
        </div>
      </div>
      <EditDialog setPositionChanged={setPositionChanged} />
      <Footer />
    </>
  );
}