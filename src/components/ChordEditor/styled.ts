import { css } from "@emotion/css";
import styled from "@emotion/styled";

export const Container = styled.div`
  user-select: none;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const EditorContainer = styled.div`
  padding: 20px;
  flex-grow: 1;
`;

export const Editor = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ChordLine = styled.div`
  height: 40%;
  border-bottom: #888 2px solid;
  display: flex;
`;

export const LineHeader = styled.div`
  width: 100px;
  height: 100%;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const RhythmLine = styled.div`
  height: 40%;
  display: flex;
`;

export const ChordContainer = styled.div`
  flex-grow: 1;
  display: flex;
  overflow-x: auto;
`;

export const ChordBox = (count: number) => css`
  min-width: 55px;
  height: 100%;
  width: calc(100% / ${count});
  border: 2px dotted #aaa;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  &:nth-child(4n+1) {
    border-left: #f50e0a 3px solid;
  }
`;

export const TonicChordBox = css`
  border: 2px solid #aaa;
  background-color: #477fff;
`;

export const SubDominantChordBox = css`
  border: 2px solid #aaa;
  background-color: #19e341;
`;

export const DominantChordBox = css`
  border: 2px solid #aaa;
  background-color: #ff475d;
`;

export const BoxContainer = styled.div`
  width: 260px;
  padding: 12px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  user-select: none;
`;

export const TonicIcon = css`
  height: 80px;
  width: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #477fff;,
`;

export const SubDominantIcon = css`
  height: 80px;
  width: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #19e341;
`;

export const DominantIcon = css`
  height: 80px;
  width: 80px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff475d;
`;
