import { useGetChartById } from "@/hooks/api/chart.hook";
import { useParams } from "react-router-dom";
import ChartForm from "./forms/ChartForm";
import { Container, Grid, Paper } from "@mantine/core";
import Data from "./Data";
import Breadcrumbs from "@/components/Breadcrumbs";


const ViewData = () => {
   const { id } = useParams();
  const [data] = useGetChartById(id as string);
  if (data.data)
    return (
        <Container size="xl">
          <Breadcrumbs data={[{ name: "Diet Chart", path: "/diet-chart" }, { name: data.data.name }]} />
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="md" radius="lg">
                <ChartForm data={data.data} />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Data chart={data.data} isViewing={true} />
            </Grid.Col>
          </Grid>
        </Container>
      );
//   const { id } = useParams();
//   const [list] = useGetMealListByChartId(id as string);
//   const [mealModal, setMealModal] = useState<{
//     open: boolean;
//     isEditing: boolean;
//     data?: MealListInfo;
//   }>({ open: false, isEditing: false });

  

//   return (
//     <Paper withBorder p="md" radius="lg">
//       <LoadingOverlay visible={list.isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
//       {list.data && (
//         <>
//           <Grid grow gutter="xs">
//             <Grid.Col span={{ xs: 3, base: 6 }}>
//               <MacroCard type="Calories" color="cyan" total={100} amount={chart.intakeCalories} />
//             </Grid.Col>
//             <Grid.Col span={{ xs: 3, base: 6 }}>
//               <MacroCard type="Protein" color="green" total={chart.protein} amount={calToGm(calcPercentage(chart.intakeCalories, chart.protein), "protein")} />
//             </Grid.Col>
//             <Grid.Col span={{ xs: 3, base: 6 }}>
//               <MacroCard type="Fat" color="orange" total={chart.fat} amount={calToGm(calcPercentage(chart.intakeCalories, chart.fat), "fat")} />
//             </Grid.Col>
//             <Grid.Col span={{ xs: 3, base: 6 }}>
//               <MacroCard type="Carb" color="red" total={chart.carb} amount={calToGm(calcPercentage(chart.intakeCalories, chart.carb), "carbohydrates")} />
//             </Grid.Col>
//           </Grid>
//           <Divider my="xs" />

//           <Group justify="space-between" mb="xs">
//             <Title order={4}>Meal List</Title>
//             <Group gap="xs">
//               <Button
//                 leftSection={<IconPlus size={16} />}
//                 size="xs"
//                 onClick={() => {
//                   setMealModal({
//                     open: true,
//                     isEditing: false,
//                   });
//                 }}
//                 data-no-print
//               >
//                 Share
//               </Button>
//               <Button
//                 leftSection={<IconFile size={16} />}
//                 size="xs"
//                 onClick={() => {
//                   window.print();
//                 }}
//                 data-no-print
//               >
//                 Export
//               </Button>
//             </Group>
//           </Group>
//           <Divider my="xs" />
//           <MacrosBadge style={{ flex: 1 }} wrapper={{ mb: "sm" }} protein={list.data.protein} fat={list.data.fat} carb={list.data.carb} size="lg" />
//           <Paper withBorder radius="md">
//             <div className="table-wrapper">
//               <table className="test-table" style={{ width: "100%" }}>
//                 <tbody>
//                   <tr className="t-head">
//                     <td style={{}}>Name</td>
//                     <td style={{ width: "12%"}}>Amount</td>
//                     <td style={{ width: "12%", textAlign:"center" }}>Protein</td>
//                     <td style={{ width: "12%", textAlign:"center" }}>Fat</td>
//                     <td style={{ width: "12%", textAlign:"center" }}>Carbohydrate </td>
//                   </tr>
//                   {list.data.mealList?.map((item) => (
//                     <Fragment key={item.id}>
//                       <tr className="t-meal-head">
//                         <td colSpan={2}>{item.name}</td>
//                         <td align="center">{item.protein} g</td>
//                         <td align="center">{item.fat} g</td>
//                         <td align="center">{item.carb} g</td>
//                       </tr>
//                       {item.mealFood.map((mealFood) => {
//                         return (
//                           <tr key={mealFood.id}>
//                             <td>
//                               <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 8 }}>
//                                 <IconSalad size={16} />
//                                 {mealFood.foodItem.name}
//                               </div>
//                             </td>
//                             <td align="center">
//                               {mealFood.qty} {mealFood.foodItem.metric === METRIC.GRAM ? "g" : (mealFood.foodItem.metric === METRIC.PIECE ?"pc" : "ml") }
//                             </td>
//                             <td align="center">{(mealFood.foodItem.protein * mealFood.qty).toFixed(2)} g</td>
//                             <td align="center">{(mealFood.foodItem.carb * mealFood.qty).toFixed(2)} g</td>
//                             <td align="center">{(mealFood.foodItem.fat * mealFood.qty).toFixed(2)} g</td>
//                           </tr>
//                         );
//                       })}
//                     </Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </Paper>

//           {/* modals */}

//           {/* meal modal */}
//           <Modal
//             opened={mealModal.open}
//             onClose={() => {
//               setMealModal({
//                 open: false,
//                 isEditing: false,
//                 data: undefined,
//               });
//             }}
//             title={mealModal.isEditing ? "Update Your Meal" : "Add New Meal"}
//           >
//             <MealForm
//               isEditing={mealModal.isEditing}
//               mealListInfo={mealModal.data}
//               onClose={() => {
//                 setMealModal({
//                   open: false,
//                   isEditing: false,
//                   data: undefined,
//                 });
//               }}
//             />
//           </Modal>
//           {/* end of meal modal */}

//           {/* delete meal modal */}

//           <Modal opened={deleteMealListModal.open} onClose={() => setDeleteMealListModal({ open: false, isDeleting: false, mealListId: undefined })} title="Please confirm your action" centered>
//             <Text size="sm" mb="xl">
//               Are you sure want to delete your meal?
//             </Text>
//             <Group justify="right">
//               <Button size="xs" onClick={() => setDeleteMealListModal({ open: false, isDeleting: false, mealListId: undefined })} variant="outline" disabled={deleteMealListModal.isDeleting}>
//                 Cancel
//               </Button>
//               <Button size="xs" onClick={handleDeleteMealList} color="red" loading={deleteMealListModal.isDeleting}>
//                 Delete
//               </Button>
//             </Group>
//           </Modal>
//           {/* end of delete meal modal */}

//           {/* FoodItem Add Modal */}
//           <Modal
//             opened={mealFoodModal.open}
//             onClose={() => {
//               setMealFoodModal({
//                 open: false,
//                 isEditing: false,
//                 mealFood: undefined,
//                 mealListId: "",
//               });
//             }}
//             title={mealFoodModal.isEditing ? "Update your food" : "Add new meal"}
//           >
//             {mealFoodModal.mealListId && (
//               <FoodForm
//                 mealListId={mealFoodModal.mealListId}
//                 isEditing={mealFoodModal.isEditing}
//                 mealFood={mealFoodModal.mealFood}
//                 onClose={() => {
//                   setMealFoodModal({
//                     open: false,
//                     isEditing: false,
//                     mealFood: undefined,
//                     mealListId: "",
//                   });
//                 }}
//               />
//             )}
//           </Modal>
//           {/* end of FoodItem Add Modal */}

//           {/* delete food modal */}
//           <Modal
//             opened={deleteFoodModal.open}
//             onClose={() =>
//               setDeleteFoodModal({
//                 open: false,
//                 isDeleting: false,
//                 mealFoodId: undefined,
//               })
//             }
//             title="Please confirm your action"
//             centered
//           >
//             <Text size="sm" mb="xl">
//               Are you sure want to delete your meal?
//             </Text>
//             <Group justify="right">
//               <Button
//                 size="xs"
//                 onClick={() =>
//                   setDeleteFoodModal({
//                     open: false,
//                     isDeleting: false,
//                     mealFoodId: undefined,
//                   })
//                 }
//                 variant="outline"
//                 disabled={deleteFoodModal.isDeleting}
//               >
//                 Cancel
//               </Button>
//               <Button size="xs" onClick={handleDeleteFood} color="red" loading={deleteFoodModal.isDeleting}>
//                 Delete
//               </Button>
//             </Group>
//           </Modal>
//           {/* end of delete food modal */}

//           {/* end of modals */}
//         </>
//       )}
//     </Paper>
//   );
};

export default ViewData;
