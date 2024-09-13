import { useContext, useEffect, useState } from "react";
import TitleHeaderLayout from "../../layouts/TitleHeaderLayout/TitleHeaderLayout";
import ScoreFrameworkCard from "../../components/ScoreFrameworkCard";
import { useParams, useSearchParams } from "react-router-dom";
import ScoreBreakdownCard from "../../components/ScoreBreakdownCard";
import ScoreTotalCard from "../../components/ScoreTotalCard";
import { FrameworkLiveScores, FrameworkScores } from "../../types/framework";
import FrameworkService from "../../services/FrameworkService";
import { AuthContext } from "../../context/AuthContextProvider";
import { CircularProgress } from "@mui/material";
import CompanyService from "../../services/CompanyService";
import { CompanyDetails } from "../../types/company";
import { Chart } from "react-chartjs-2";
import { ChartData } from "chart.js";
import SelectFrameworkBox from "../../components/SelectFrameworkBox";

const COLORS = {
  E: "#2e8b21",
  S: "#0062ff",
  G: "#ec4040",
};

const EsgScoresPage = () => {
  const auth = useContext(AuthContext);
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const [scores, setScores] = useState<FrameworkScores>();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>();
  const [liveScores, setLiveScores] = useState<FrameworkLiveScores>();
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<ChartData>();

  useEffect(() => {
    const fetchData = async () => {
      const company = await CompanyService.companyDetails(companyId || "");
      setCompanyDetails(company);
      const frameworks = await FrameworkService.searchFrameworks(auth.token, '', '0');
      const response = await FrameworkService.frameworkScores(
        auth.token,
        searchParams.get("framework") || frameworks[0].framework_id,
        companyId || ""
      );
      setScores(response);
      const allLiveScores = await FrameworkService.frameworkLiveScores(
        auth.token,
        searchParams.get("framework") || frameworks[0].framework_id,
        companyId || ""
      );
      setLiveScores(allLiveScores);
    };
    fetchData();
    setLoading(false);
  }, [searchParams]);

  useEffect(() => {
    const eScores = liveScores?.scores.environmental || [];
    const sScores = liveScores?.scores.social || [];
    const gScores = liveScores?.scores.governance || [];
    const combinedScores = eScores.concat(sScores, gScores);
    const years = combinedScores.map((s) => s.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const validYears = [];
    for (let i = minYear; i <= maxYear; i++) {
      validYears.push(i);
    }
    setChartData({
      labels: validYears,
      datasets: [
        {
          label: "Environmental Score",
          data: eScores.map((s) => s.score),
          backgroundColor: COLORS.E,
          borderColor: COLORS.E,
        },
        {
          label: "Social Score",
          data: sScores.map((s) => s.score),
          backgroundColor: COLORS.S,
          borderColor: COLORS.S,
        },
        {
          label: "Governance Score",
          data: gScores.map((g) => g.score),
          backgroundColor: COLORS.G,
          borderColor: COLORS.G,
        },
      ],
    });
  }, [liveScores]);

  return (
    <TitleHeaderLayout title="ESG Scores">
      <h1 className="font-title font-bold text-4xl mb-1">
        {companyDetails?.name}
      </h1>
      <p className="mb-6 pr-16">
        This page calculates ESG scores for a company by analysing and
        integrating data across various environmental, social, and governance
        metrics. Users can select relevant ESG frameworks, and generate a
        comprehensive breakdown that highlight the company's performance and
        risk in these areas.
      </p>
      {!searchParams.get("framework") ? (
        <div className="flex items-center justify-center mt-8">
          <SelectFrameworkBox />
        </div>
      ) : (
        <>
          {loading ? (
            <CircularProgress className="mx-auto" />
          ) : (
            <>
              {/* Framework Section */}
              <section className="grid grid-cols-[minmax(250px,400px),minmax(400px,1fr),minmax(160px,300px)] gap-8">
                {/* Framework Select Section. */}
                <ScoreFrameworkCard scoreDetails={scores} />

                {/* Score Breakdown Section. */}
                <ScoreBreakdownCard scoreDetails={scores} />

                {/* Total Score Section. */}
                <ScoreTotalCard scoreDetails={scores} />
              </section>

              {/* Live Score Section */}
              <section>
                <h2 className="font-title font-bold text-2xl border-b-2 border-ecom-divider pb-2 my-4 mt-8">
                  Live ESG Scores
                </h2>

                {chartData && (
                  <Chart
                    className="p-8"
                    type="bar"
                    data={chartData}
                    options={{
                      responsive: true,
                      scales: {
                        x: {
                          display: true,
                          ticks: {
                            color: "#000",
                          },
                          title: {
                            display: true,
                            text: "Metric Year",
                            color: "#000",
                            font: {
                              family: "Roboto",
                              size: 12,
                              weight: "normal",
                              lineHeight: 1.2,
                            },
                          },
                        },
                        y: {
                          display: true,
                          ticks: {
                            color: "#000",
                          },
                          title: {
                            display: true,
                            text: "Score",
                            color: "#000",
                            font: {
                              family: "Roboto",
                              size: 12,
                              weight: "normal",
                              lineHeight: 1.2,
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              </section>
            </>
          )}
        </>
      )}
    </TitleHeaderLayout>
  );
};

export default EsgScoresPage;
