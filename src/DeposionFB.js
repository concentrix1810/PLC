import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineUp, AiOutlineSearch } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { data } from "./data";
import "./styles.css";

const customToastStyle = {
  backgroundColor: "#00804a",
  color: "#fff",
};

const DeposionFB = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayMode, setDisplayMode] = useState("full"); // State for display mode
  const [typingText, setTypingText] = useState(""); // State để quản lý nội dung gõ
  const fullText = "G Chúng tôi có thể giúp gì cho bạn?"; // Nội dung bạn muốn gõ

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);

    // Load display mode from local storage
    const mode = localStorage.getItem("displayMode") || "full";
    setDisplayMode(mode);
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem("displayMode", displayMode); // Save display mode to local storage
  }, [displayMode]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let index = 0; // Chỉ số của ký tự hiện tại
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypingText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval); // Dừng khi đã gõ xong
      }
    }, 100); // Thay đổi giá trị này để điều chỉnh tốc độ gõ

    return () => clearInterval(typingInterval); // Dọn dẹp interval khi component unmount
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Đã sao chép: "${text}"`, {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: true,
          style: customToastStyle,
        });
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const removeDiacritics = (str) => {
    const diacriticsMap = {
      á: "a",
      à: "a",
      ả: "a",
      ã: "a",
      ạ: "a",
      ắ: "a",
      ằ: "a",
      ẳ: "a",
      ẵ: "a",
      ặ: "a",
      ấ: "a",
      ầ: "a",
      ẩ: "a",
      ẫ: "a",
      ậ: "a",
      é: "e",
      è: "e",
      ẻ: "e",
      ẽ: "e",
      ẹ: "e",
      ế: "e",
      ề: "e",
      ể: "e",
      ễ: "e",
      ệ: "e",
      í: "i",
      ì: "i",
      ỉ: "i",
      ĩ: "i",
      ị: "i",
      ó: "o",
      ò: "o",
      ỏ: "o",
      õ: "o",
      ọ: "o",
      ố: "o",
      ồ: "o",
      ổ: "o",
      ỗ: "o",
      ộ: "o",
      ớ: "o",
      ờ: "o",
      ở: "o",
      ỡ: "o",
      ợ: "o",
      ú: "u",
      ù: "u",
      ủ: "u",
      ũ: "u",
      ụ: "u",
      ứ: "u",
      ừ: "u",
      ử: "u",
      ữ: "u",
      ự: "u",
      ý: "y",
      ỳ: "y",
      ỷ: "y",
      ỹ: "y",
      ỵ: "y",
      đ: "d",
    };

    return str
      .split("")
      .map((char) => diacriticsMap[char] || char)
      .join("");
  };

  const handleSearch = (term) => {
    setSearchTerm(term);

    const normalizedTerm = removeDiacritics(term.toLowerCase());

    if (term) {
      const results = data.Complains.filter(
        (complain) =>
          (complain.Type &&
            removeDiacritics(complain.Type.toLowerCase()).includes(
              normalizedTerm
            )) ||
          complain.Details.some(
            (detail) =>
              detail.Remark &&
              removeDiacritics(detail.Remark.toLowerCase()).includes(
                normalizedTerm
              )
          )
      ).map((complain) => complain.Type);

      setSearchResults(results);
      setShowHistory(false);
    } else {
      setSearchResults([]);
      setShowHistory(true);
    }
  };

  const handleSelectResult = (type) => {
    setSearchTerm(type);
    setSearchResults([]);

    if (!searchHistory.includes(type)) {
      const newHistory = [type, ...searchHistory].slice(0, 4);
      setSearchHistory(newHistory);
    }
    setShowHistory(false);
  };

  const handleSelectHistory = (term) => {
    setSearchTerm(term);
    setSearchResults([]);
    setShowHistory(false);
  };

  const handleFocusInput = () => {
    if (searchTerm === "") {
      setShowHistory(true);
    }
  };

  const handleBlurInput = () => {
    setTimeout(() => {
      setShowHistory(false);
    }, 100);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowHistory(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uniqueCategories = [
    ...new Set(data.Complains.map((complain) => complain.Category)),
  ];

  const filteredComplains = data.Complains.filter((complain) => {
    const normalizedSearchTerm = removeDiacritics(searchTerm.toLowerCase());

    return (
      (selectedCategory ? complain.Category === selectedCategory : true) &&
      (searchTerm
        ? (complain.Type &&
            removeDiacritics(complain.Type.toLowerCase()).includes(
              normalizedSearchTerm
            )) ||
          complain.Details.some(
            (detail) =>
              detail.Remark &&
              removeDiacritics(detail.Remark.toLowerCase()).includes(
                normalizedSearchTerm
              )
          )
        : true)
    );
  });

  return (
    <div>
      <ToastContainer />
      <div className="search-container">
        <div className="input-container">
          <div className="typing-effect">{typingText}</div>{" "}
          <div className="input-container">
            <AiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo Type & Remark"
              value={searchTerm}
              onFocus={handleFocusInput}
              onBlur={handleBlurInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchTerm && (
              <span className="clear-icon" onClick={clearSearch}>
                <AiOutlineClose />
              </span>
            )}
          </div>
        </div>

        {searchResults.length > 0 && searchTerm && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="result-item"
                onClick={() => handleSelectResult(result)}
              >
                {result}
              </div>
            ))}
          </div>
        )}

        {showHistory && searchHistory.length > 0 && (
          <div className="search-history">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => handleSelectHistory(item)}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        <div className="display-mode-container">
          <select
            id="display-mode-select"
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
          >
            <option value="full">Hiển thị Root Cause</option>
            <option value="compact">Ẩn Root Cause</option>
          </select>
        </div>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th className="header-son-soi" style={{ textAlign: "center" }}>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Tất cả</option>
                {uniqueCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </th>
            <th
              className="header-top-disposition"
              style={{ textAlign: "center" }}
            >
              Top Disposition
            </th>
            <th className="header-problem" style={{ textAlign: "center" }}>
              Problem L1
            </th>
            <th className="header-problem" style={{ textAlign: "center" }}>
              Problem L2
            </th>
            <th className="header-problem" style={{ textAlign: "center" }}>
              Problem L3
            </th>
            <th className="header-action" style={{ textAlign: "center" }}>
              Action L1
            </th>
            <th className="header-action" style={{ textAlign: "center" }}>
              Action L2
            </th>
            <th className="header-action" style={{ textAlign: "center" }}>
              Action L3
            </th>
            {displayMode === "full" && (
              <>
                <th
                  className="header-root-cause"
                  style={{ textAlign: "center" }}
                >
                  Root Cause L1
                </th>
                <th
                  className="header-root-cause"
                  style={{ textAlign: "center" }}
                >
                  Root Cause L2
                </th>
                <th
                  className="header-root-cause"
                  style={{ textAlign: "center" }}
                >
                  Root Cause L3
                </th>
              </>
            )}
            <th className="header-remark" style={{ textAlign: "center" }}>
              Remark
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredComplains.map((complain, index) =>
            complain.Details.map((detail, detailIndex) => (
              <tr key={`${index}-${detailIndex}`}>
                {detailIndex === 0 && (
                  <>
                    <td rowSpan={complain.Details.length}>
                      {complain.Category}
                    </td>
                    <td rowSpan={complain.Details.length}>{complain.Type}</td>
                    <td
                      rowSpan={complain.Details.length}
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() =>
                        handleCopy(complain.ProblemLevels.ProblemL1.Description)
                      }
                    >
                      {complain.ProblemLevels.ProblemL1.Description}
                    </td>
                    <td
                      rowSpan={complain.Details.length}
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() =>
                        handleCopy(complain.ProblemLevels.ProblemL2.Description)
                      }
                    >
                      {complain.ProblemLevels.ProblemL2.Description}
                    </td>
                    <td
                      rowSpan={complain.Details.length}
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() =>
                        handleCopy(complain.ProblemLevels.ProblemL3.Description)
                      }
                    >
                      {complain.ProblemLevels.ProblemL3.Description}
                    </td>
                  </>
                )}
                {detail.Actions.map((action, actionIdx) => (
                  <td
                    key={actionIdx}
                    onClick={() => handleCopy(action)}
                    style={{ cursor: "pointer" }}
                  >
                    {action}
                  </td>
                ))}
                {displayMode === "full" &&
                  detail.RootCauses.map((cause, causeIdx) => (
                    <td
                      key={causeIdx}
                      onClick={() => handleCopy(cause)}
                      style={{ cursor: "pointer" }}
                    >
                      {cause}
                    </td>
                  ))}
                <td>{detail.Remark}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showScrollTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <AiOutlineUp />
        </div>
      )}
    </div>
  );
};

export default DeposionFB;
